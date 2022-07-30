let YunaClient = require("../../base/YunaClient");
let Command = require("../../base/Command");
let { Message, EmbedBuilder, version } = require("discord.js");
let { convertMS } = require("discordutility");

class Info extends Command {
  /**
   * @param {YunaClient} client
   */
  constructor(client) {
    super(client, {
      description: "Gets information about Yuna.",
      usage: "y!info",
      cooldown: 150000,
      aliases: ["botinfo", "bot-info"],
    });
    this.client = client;
  }

  /**
   * @param {Message} msg
   */
  async run(msg) {
    let embed = new EmbedBuilder().setColor("Fuchsia");
    embed.setTitle(this.client.modules.lang.info.title);
    embed.setFields([
      { name: "Name", value: this.client.user.username },
      { name: "Bot version", value: this.client.modules.version },
      { name: "Library", value: `discord.js@${version}` },
      {
        name: this.client.modules.lang.info.guilds,
        value: String(this.client.guilds.cache.size),
      },
      {
        name: this.client.modules.lang.info.users,
        value: String(this.client.users.cache.size),
      },
      {
        name: this.client.modules.lang.info.commands,
        value: String(this.client.command.size),
      },
      {
        name: this.client.modules.lang.info.aliases,
        value: String(this.client.aliases.size),
      },
      {
        name: "Ping",
        value: this.client.modules.lang.fetching,
      },
      {
        name: this.client.modules.lang.info.uptime,
        value: this.client.modules.lang.fetching,
      },
    ]);
    await msg.channel.send({ embeds: [embed] }).then(async (m) => {
      const latency = m.createdTimestamp - msg.createdTimestamp;
      let converted = convertMS(this.client.uptime);
      let embed = new EmbedBuilder().setColor("Fuchsia");
      embed.setTitle(this.client.modules.lang.info.title);
      embed.setFields([
        { name: "Name", value: this.client.user.username },
        { name: "Bot version", value: this.client.modules.version },
        { name: "Library", value: `discord.js@${version}` },
        {
          name: this.client.modules.lang.info.guilds,
          value: String(this.client.guilds.cache.size),
        },
        {
          name: this.client.modules.lang.info.users,
          value: String(this.client.users.cache.size),
        },
        {
          name: this.client.modules.lang.info.commands,
          value: String(this.client.command.size),
        },
        {
          name: this.client.modules.lang.info.aliases,
          value: String(this.client.aliases.size),
        },
        {
          name: "Ping",
          value: `API: ${Math.round(this.client.ws.ping)}ms / Bot ${Math.round(
            latency
          )}ms`,
        },
        {
          name: this.client.modules.lang.info.uptime,
          value: `${converted.d} ${this.client.modules.lang.time.day} / ${converted.h} ${this.client.modules.lang.time.hour} / ${converted.m} ${this.client.modules.lang.time.minutes} / ${converted.s} ${this.client.modules.lang.time.seconds}`,
        },
      ]);
      m.edit({ embeds: [embed] });
    });
  }
}

module.exports = Info;
