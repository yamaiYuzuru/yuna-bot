let { model, Schema } = require("mongoose");

let GuildSchema = new Schema({
  guildID: { type: String, required: true },
  logChannel: { type: String, default: "" },
  aboutUsID: { type: String, default: "" },
  aboutUsMsg: { type: String, default: "" },
  teamRole: { type: String, default: "" },
});

module.exports = model("guilds", GuildSchema);
