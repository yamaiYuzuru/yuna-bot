let { Schema, model } = require("mongoose");

let ReactionRoleSchema = new Schema({
  guildID: { type: String, required: true },
  msgID: { type: String, required: true },
  roleID: { type: String, required: true },
  reaction: { type: String, required: true },
});

module.exports = model("reactionroles", ReactionRoleSchema);
