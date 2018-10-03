var mongoose = require("mongoose");
var schema = mongoose.Schema;
var userschema = new schema(
  {
    member1id: String,
    member2id: String,
    Message: Array
  },
  { collection: "ChatDetails" }
);
module.exports = mongoose.model("ChatDetails", userschema);
