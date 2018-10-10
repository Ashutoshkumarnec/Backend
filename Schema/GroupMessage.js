var mongoose = require("mongoose");
var schema = mongoose.Schema;
var userschema = new schema(
  {
    GroupRoom: { type: String },
    Message: Array
  },
  { collection: "GroupChatDetails" }
);
module.exports = mongoose.model("GroupChatDetails", userschema);
