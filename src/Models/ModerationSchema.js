let { Schema, model } = require("mongoose");

let ModSchema = new Schema({
  id: { type: String, required: true },
  userID: { type: String, required: true },
  guildID: { type: String, required: true },
  moderator: { type: String, required: true },
  reason: { type: String, required: true },
  date: { type: Number, required: true },
});

module.exports = model("moderation", ModSchema);
