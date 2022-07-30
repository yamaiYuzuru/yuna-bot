let { Guild } = require("discord.js");
const YunaClient = require("../base/YunaClient");
let { yunaSchema } = require("../Models");

class GuildCreate {
  /**
   * @param {YunaClient} client
   */
  constructor(client) {
    this.client = client;
  }

  /**
   * @param {Guild} guild
   */
  async run(guild) {
    let yuna = await yunaSchema.findOne({ clientID: this.client.user.id });
    if (!yuna) return;
    if (!yuna.network_guilds.includes(guild.id)) return guild.leave();
  }
}

module.exports = GuildCreate;
