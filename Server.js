var express = require("express");
var app = express();
// var cors = require("cors");
// var router = require("../Server/Router/ChatRoutes.js");
// var bodyParser = require("body-parser");
// var mongoose = require("mongoose");
// app.use(cors());
// app.use(
//   bodyParser.urlencoded({
//     extended: false
//   })
// );
// app.use(bodyParser.json());
// mongoose.connect("mongodb://localhost:27017/reactdetails");
// // app.use("/", router);

var server = require("http").Server(app);
var io = require("socket.io")(server);
server.listen(3000, function() {
  console.log("Server is Running at 3000");
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
      io.to(socket_id).emit(
        "Error",
        "Given username already exist , try with another"
      );
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

  function updatenicknames() {
    io.emit("usernames", names);
    console.log("USer Connected", names);
  }
  // socket.on("Send Message", function(data) {});
  socket.on("disconnect", function(data) {
    if (!socket.username) return;
    names.splice(names.indexOf(socket.username), 1);
    ids.splice(ids.indexOf(socket.id), 1);
    updatenicknames();
    io.emit("Server-Send-Text", data, "  Disconnected");
    console.log("User Disconnected", socket.username);
  });
});
