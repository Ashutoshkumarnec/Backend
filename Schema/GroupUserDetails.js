var mongoose = require("mongoose");
var schema = mongoose.Schema;
var userschema = new schema(
  {
    GroupName: { type: String },
    GroupRoom: { type: String, unique: true },
    GroupUser: Array,
    GroupAdmin: { type: String }
  },
  { collection: "GroupUserDetails" }
);
module.exports = mongoose.model("GroupUserDetails", userschema);
