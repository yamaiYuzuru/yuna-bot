let { Schema, model } = require("mongoose");

let UserSchema = new Schema({
  userID: { type: String, required: true },
  language: { type: String, default: "en_US" },
});

module.exports = model("users", UserSchema);
