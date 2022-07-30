const YunaClient = require("./YunaClient");
let { Message } = require("discord.js");

class Command {
  /**
   * @param {YunaClient} client The YunaClient.
   * @param {Object} options Command options.
   * @param {Object} options.info
   * @param {String} options.info.description
   * @param {String} options.info.usage
   * @param {Number} options.info.cooldown
   * @param {String[]} options.info.aliases
   */
  constructor(client, options) {
    this.client = client;

    /**
     * Command information
     */
    this.info = {
      description: options.description || "Error 404\nNot Found!",
      usage: options.usage || "",
      cooldown: options.cooldown || 15000,
      aliases: options.aliases || [],
    };

    /**
     * @type Set<String>
     */
    this.cooldown = new Set();
  }

  /**
   * Put a user on cooldown for this command.
   * @param {String} userID The ID of the user to put on the cooldown.
   */
  startCooldown(userID) {
    this.cooldown.add(userID);

    setTimeout(() => {
      this.cooldown.delete(userID);
    }, this.info.cooldown);
  }

  /**
   * @param {Message} msg
   */
  setMessage(msg) {
    this.message = msg;
  }

  /**
   *
   * @param {Message} msg
   */
  async respond(msg) {
    return this.message.channel.send(msg);
  }
}

module.exports = Command;
