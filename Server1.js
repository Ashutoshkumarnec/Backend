var express = require("express");
var app = express();
var cors = require("cors");
var router = require("./Router/ChatRoutes.js");
var bodyParser = require("body-parser");
var mongoose = require("mongoose");
app.use(cors());
app.use(
  bodyParser.urlencoded({
    extended: false
  })
);
app.set("port", process.env.PORT || 5000);
app.use(bodyParser.json());
// mongoose.connect(
//   "mongodb://localhost:27017/ChatApp",
//   function() {
//     console.log("Mongo Database Connected");
//   }
// );
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
var index;
io.on("connection", function(socket) {
  console.log("User Connected", socket.id);
  var socket_id = socket.id;
  socket.on("new-user", function(username, callback) {
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
      socket.username = username;
      names.push(socket.username);
      ids.push(socket.id);
      updatenicknames();
      // io.emit("usernames", names);
      console.log(names);
      console.log(ids);
      socket.emit("Server-Send-Text", "  Connected");
    }
  });
  socket.on("ForceLogout", function(user) {
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
      names.splice(names.indexOf(user), 1);
      ids.splice(idss, 1);
      keys = 0;
      socket.broadcast
        .to(socketsid)
        .emit("ForceLogout", "You have been Logged out");
    }
  });
  socket.on("Reload", function(msg) {
    io.emit("Reloads", "Now");
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
  function updatenicknames() {
    io.emit("usernames", names);
    console.log("USer Connected", names);
  }
  socket.on("Logout", function(data) {
    if (!socket.username) return;
    names.splice(names.indexOf(socket.username), 1);
    ids.splice(ids.indexOf(socket.id), 1);
    updatenicknames();
    // io.emit("Server-Send-Text", data, "  Disconnected");
    console.log("User Disconnected", socket.username);
  });
  socket.on("unmounting", function(value) {
    console.log("Unmounting value", value);
  });
  // socket.on("Send Message", function(data) {});
  socket.on("disconnect", function(data) {
    if (!socket.username) return;
    names.splice(names.indexOf(socket.username), 1);
    ids.splice(ids.indexOf(socket.id), 1);
    app.use("/ChangeStatus1", router);
    updatenicknames();
    io.emit("Server-Send-Text", data, "  Disconnected");
    console.log("User Disconnected", socket.username);
  });
});
