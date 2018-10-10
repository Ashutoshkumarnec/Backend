var express = require("express");
var app = express();
var cors = require("cors");
var router = require("./Router/ChatRoutes.js");
var bodyParser = require("body-parser");
var mongoose = require("mongoose");
// var mongodb = require("mongodb");
app.use(cors());
app.use(
  bodyParser.urlencoded({
    extended: false
  })
);
app.set("port", process.env.PORT || 5000);
app.use(bodyParser.json());
var url = process.env.MONGOLAB_URI;
mongoose.connect(
  url,
  function(err, con) {
    if (err) {
      console.log("Error");
    } else {
      console.log("Mongo Database Connected");
    }
  }
);
// try {
//   var url = process.env.MONGOLAB_URI;
//   mongodb.connect(
//     url,
//     function(err, res) {
//       if (err) {
//         console.log("Error in connection to MongoDb", err);
//       } else {
//         console.log("Database connected");
//       }
//     }
//   );
// } catch (err) {
//   console.log("Error", err);
// }
app.use("/", router);
// app.get("/", function(err, res) {
//   res.send("Hello");
// });
var server = require("http").Server(app);
var io = require("socket.io")(server);
server.listen(app.get("port"), function() {
  console.log("Server is Running at ", app.get("port"));
});
app.get("/", function(req, res) {
  res.sendFile(__dirname + "/index.html");
});
var names = [],
  ids = [];
key = 0;
var Socket_object = [];
var index;
io.on("connection", function(socket) {
  console.log("User Connected", socket.id);
  var socket_id = socket.id;
  socket.on("new-user", async function(username, callback) {
    console.log(username, "Online");
    for (var i = 0; i < names.length; i++) {
      console.log("Loop value", i);
      if (names[i] === username) {
        key = 1;
        break;
      } else {
        key = 0;
      }
    }
    if (key === 1) {
      console.log("Error", socket.id);

      // names.splice(names.indexOf(socket.username), 1);
      // ids.splice(ids.indexOf(socket.id), 1);
      // index = names.indexOf(username);
      // var socketid = ids[index];
      // console.log("User Diconnected");
      // // updatenicknames();
      // // Logout();
      // socket.broadcast
      //   .to(socketid)
      //   .emit("Error", "Someone tries to Login to your Account");
      key = 0;
      io.to(socket_id).emit("Error", "Login Not Allowed ");
    } else {
      // console.log("Error1", names.length());
      console.log("Inside else");
      await Socket_object.push(socket);
      socket.username = username;
      names.push(socket.username);
      ids.push(socket.id);
      await updatenicknames();
      // io.emit("usernames", names);
      console.log(names);
      console.log(ids);
      socket.emit("Server-Send-Text", "  Connected");
    }
  });
  socket.on("ForceLogout", async function(user) {
    var keys;
    console.log("User to be Logged out ", user);
    for (var i = 0; i < names.length; i++) {
      console.log("Loop value", i);
      if (names[i] === user) {
        keys = 1;
        break;
      } else {
        keys = 0;
      }
    }
    if (keys === 1) {
      var idss = names.indexOf(user);
      var socketsid = ids[idss];
      await delete names[names.indexOf(user)];
      await delete ids[idss];
      keys = 0;
      socket.broadcast
        .to(socketsid)
        .emit("ForceLogout", "You have been Logged out");
    }
  });
  socket.on("Reload", function(msg) {
    io.emit("Reloads", "Now");
  });
  socket.on("CreatedGroup", async function(GroupUser, room) {
    console.log("All Group User", GroupUser, "Room :", room);
    for (var i = 0; i < GroupUser.length; i++) {
      var indexs = await names.indexOf(GroupUser[i]);
      await Socket_object[indexs].join(room);
    }
    socket.broadcast.to(room).emit("NewGroupJoined", "Joined");
    // io.sockets.in(room).emit("NewGroupJoined", "Joined");
    // io.to(room).emit("NewGroupJoined", "Joined");
  });
  socket.on("NewGroup", async function(username) {
    console.log("New Group Users", username);
    if (username.length !== 0) {
      for (var i = 0; i < username.length; i++) {
        console.log("Group Room", username[i].GroupRoom);
        console.log("Socket.id", socket.id);
        await socket.join(username[i].GroupRoom);
        // console.log("Socket Details", socket);
      }
    }
  });
  socket.on("NewGroupMessage", function(text, Groupname, room, Messageby) {
    console.log("GroupName", Groupname);
    socket.broadcast.to(room).emit("GroupMessage", {
      Messagefrom: Groupname,
      Message: text,
      Room: room,
      MessageBy: Messageby
    });
  });
  socket.on("is-typing", function(user) {
    console.log("typing");
    index = names.indexOf(user);
    var socketid = ids[index];
    socket.broadcast.to(socketid).emit("typing", socket.username);
  });
  socket.on("Close-typing", function(user) {
    index = names.indexOf(user);
    var socketid = ids[index];
    socket.broadcast.to(socketid).emit("Closeit", socket.username);
  });
  // socket.emit("usernames", clients);
  socket.on("newMessage", function(msg, user) {
    console.log("Client send ", msg, "From", user);
    // io.emit("Server-Send-Text", msg);
    // clients[user].emit("New-Message", { msg: msg, from: socket.nicknames });
    // clients[socket.user].emit("New-Message", {
    //   msg: msg,
    //   from: socket.nicknames
    // });
    // socket.emit("New-Message", { msg: msg, from: socket.nicknames });
    index = names.indexOf(user);
    var socketid = ids[index];
    socket.broadcast
      .to(socketid)
      .emit("Message", { Messagefrom: socket.username, Message: msg });
    console.log(socketid);
    console.log("My socket id", socket.id);
  });
  function Logout() {
    socket.broadcast
      .to(socket.id)
      .emit("Error1", "You are not Allowed to Login");
  }
  async function updatenicknames() {
    await io.emit("usernames", names);
    console.log("USer Connected", names);
  }
  socket.on("Logout", async function(data) {
    // if (!socket.username) return;
    // await names.splice(names.indexOf(data), 1);
    // await ids.splice(names.indexOf(data), 1);
    await delete names[names.indexOf(data)];
    await delete ids[names.indexOf(data)];
    await io.emit("usernames", names);
    // io.emit("Server-Send-Text", data, "  Disconnected");
    console.log("User Disconnected", socket.username);
  });
  socket.on("unmounting", function(value) {
    console.log("Unmounting value", value);
  });
  // socket.on("Send Message", function(data) {});
  socket.on("disconnect", async function(data) {
    if (!socket.username) return;
    console.log("Disconnected names", socket.username);
    // await names.splice(names.indexOf(socket.username), 1);
    // await ids.splice(ids.indexOf(socket.id), 1);
    await delete names[names.indexOf(socket.username)];
    await delete ids[ids.indexOf(socket.id)];
    await delete Socket_object[ids.indexOf(socket.id)];
    app.use("/ChangeStatus1", router);
    console.log("Connected Users", names);
    await io.emit("usernames", names);
    // await updatenicknames();
    // io.emit("Server-Send-Text", data, "  Disconnected");
    console.log("User Disconnected", socket.username);
  });
});
