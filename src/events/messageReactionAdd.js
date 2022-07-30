const YunaClient = require("../base/YunaClient");
let { MessageReaction, User } = require("discord.js");

class MessageReactionAdd {
  /**
   * @param {YunaClient} client The YunaClient.
   */
  constructor(client) {
    this.client = client;
  }

  /**
   *
   * @param {MessageReaction} reaction
   * @param {User} user
   */
  async run(reaction, user) {
    let msg = reaction.message;
    if (user.partial) await user.fetch();
    if (reaction.partial) await reaction.fetch();
    if (msg.partial) await msg.fetch();
    let rolefetch = await this.client.modules.reactionRole.fetchrr(
      this.client,
      msg.guild.id,
      msg.id,
      reaction.emoji.name
    );
    if (!rolefetch) return;
    let member = msg.guild.members.cache.get(user.id);
    if (!member.roles.cache.has(rolefetch.rolerid)) {
      await member.roles.add(rolefetch.roleid, "Reaction Role");
    }
  }
}

module.exports = MessageReactionAdd;
