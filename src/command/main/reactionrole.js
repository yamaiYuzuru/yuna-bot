let { Message, EmbedBuilder, parseEmoji } = require("discord.js");
let YunaClient = require("../../base/YunaClient");
let Command = require("../../base/Command");

class ReactionRole extends Command {
  /**
   * @param {YunaClient} client
   */
  constructor(client) {
    super(client, {
      description: "Create a reaction role.",
      usage:
        "y!reactionrole create <role/roleID> <msgID> <emoji>\n" +
        "y!reactionrole edit <role/roleID> <msgID> <emoji>\n" +
        "y!reactionrole remove <msgID> <emoji>",
      aliases: ["rr"],
      cooldown: 20000,
    });

    this.client = client;
  }

  /**
   * @param {Message} msg
   * @param {String[]} args
   */
  async run(msg, args, user) {
    let embed = new EmbedBuilder().setColor("Fuchsia");
    switch (args[0]) {
      case "create":
        if (!args[1] || !args[2] || !args[3])
          return this.respond({
            embeds: [
              embed
                .setDescription(
                  "y!reactionrole create <role/roleID> <msgID> <emoji>"
                )
                .toJSON(),
            ],
          });
        let roleid = this.client.modules.typings.RoleID_RoleToID(
          msg.mentions.roles.first() || args[1]
        );
        this.client.modules.reactionRole.createrr(
          this.client,
          msg,
          msg.guild.id,
          args[2],
          roleid,
          parseEmoji(args[3]).name
        );
        this.respond(this.client.modules.lang.reactionrole.created);
        break;
      case "edit":
        if (!args[1] || !args[2] || !args[3])
          return this.respond({
            embeds: [
              embed
                .setDescription(
                  "y!reactionrole edit <role/roleID> <msgID> <emoji>"
                )
                .toJSON(),
            ],
          });
        roleid = this.client.modules.typings.RoleID_RoleToID(
          msg.mentions.roles.first() || args[1]
        );
        this.client.modules.reactionRole.editrr(
          this.client,
          msg.guild.id,
          args[1],
          roleid,
          parseEmoji(args[2]).name
        );
        this.respond(this.client.modules.lang.reactionrole.edited);
        break;
      case "remove":
        if (!args[1] || !args[2] || !args[3])
          return this.respond({
            embeds: [
              embed
                .setDescription("y!reactionrole remove <msgID> <emoji>")
                .toJSON(),
            ],
          });
        this.client.modules.reactionRole.deleterr(
          this.client,
          msg.guild.id,
          args[1],
          args[2]
        );
        this.respond(this.client.modules.lang.reactionrole.deleted);
        break;
      default:
        embed.addFields([
          {
            name: "create",
            value: this.client.modules.lang.reactionroles.create,
          },
          {
            name: "edit",
            value: this.client.modules.lang.reactionroles.edit,
          },
          {
            name: "remove",
            value: this.client.modules.lang.reactionroles.remove,
          },
        ]);
        this.respond({ embeds: [embed.toJSON()] });
        break;
    }
  }
}

module.exports = ReactionRole;
