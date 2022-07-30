let YunaClient = require("../../base/YunaClient");
let Command = require("../../base/Command");
let { Message, EmbedBuilder } = require("discord.js");

class ExampleCommand extends Command {
  /**
   * @param {YunaClient} client
   */
  constructor(client) {
    super(client, {
      description: "",
      usage: "y!",
      cooldown: 250000,
    });
    this.client = client;
  }

  /**
   * @param {Message} msg
   */
  async run(msg) {}
}

module.exports = ExampleCommand;
