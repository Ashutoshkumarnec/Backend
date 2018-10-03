var mongoose = require("mongoose");
var schema = mongoose.Schema;
var userschema = new schema(
  {
    username: { type: String },
    email: { type: String, unique: true },
    mobileno: { type: String },
    password: { type: String },
    Status: { type: String },
    Verified: { type: Boolean },
    Login: { type: String }
  },
  { collection: "SignUpDetails" }
);
module.exports = mongoose.model("SignUpDetails", userschema);
