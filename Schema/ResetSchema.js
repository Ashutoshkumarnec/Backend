var mongoose = require("mongoose");
var schema = mongoose.Schema;
var userschema = new schema(
  {
    id: { type: String },
    token: { type: String },
    expire: { type: Boolean }
  },
  { collection: "ResetDetails" }
);
module.exports = mongoose.model("ResetDetails", userschema);
