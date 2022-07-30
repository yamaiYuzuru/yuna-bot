let { Schema, model } = require("mongoose");

let YunaSchema = new Schema({
  clientID: { type: String, required: true },
  network_guilds: { type: [String], required: true },
});

module.exports = model("yuna", YunaSchema, "yuna");
