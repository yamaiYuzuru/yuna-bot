let { Message, EmbedBuilder, ChannelType } = require("discord.js");
const YunaClient = require("../base/YunaClient");
let { guildSchema, userSchema } = require("../Models");
let lang = require("../functions/lang");

class MessageCreate {
  /**
   * @param {YunaClient} client The YunaClient.
   */
  constructor(client) {
    this.client = client;
  }

  /**
   *
   * @param {Message} msg
   */
  async run(msg) {
    if (
      !msg.guild ||
      msg.author.bot ||
      msg.channel.type !== ChannelType.GuildText
    )
      return;

    let user = await userSchema.findOne({ userID: msg.author.id });

    if (!user) {
      let newUser = await userSchema.create({ userID: msg.author.id });
      await newUser.save();
      user = newUser;
    }

    if (!guildSchema.findOne({ guildID: msg.guild.id })) {
      let newGuild = await guildSchema.create({ guildID: msg.guild.id });
      await newGuild.save();
    }

    let prefix = "y!";

    if (!msg.content.startsWith(prefix.toLocaleLowerCase())) return;
    let embed = new EmbedBuilder().setColor("#ff96f2").setTimestamp(Date.now());
    let args = msg.content
      .slice(prefix.toLocaleLowerCase().length)
      .trim()
      .split(" ");
    let command = args.shift().toLocaleLowerCase();
    let cmd =
      this.client.command.get(command) || this.client.aliases.get(command);

    this.client.modules.lang = lang(user.language);

    if (!cmd)
      return msg.channel
        .send({
          embeds: [
            embed
              .setDescription(this.client.modules.lang.errors.noCMD)
              .toJSON(),
          ],
        })
        .then((m) => {
          setTimeout(() => {
            m.channel.messages.fetch().then(() => {
              msg.delete();
              m.delete();
            });
          }, 15000);
        });

    if (cmd.info.category === "nsfw" && !msg.channel.nsfw)
      return msg.channel
        .send({
          embeds: [
            embed.setDescription(this.client.modules.lang.errors.noNSFW),
          ],
        })
        .then((m) => {
          setTimeout(() => {
            m.channel.messages.fetch().then(() => {
              msg.delete();
              m.delete();
            });
          }, 15000);
        });

    if (
      cmd.info.category === "admin" &&
      !this.client.settings.admins.includes(msg.author.id)
    )
      return msg.channel
        .send({
          embeds: [
            embed.setDescription(this.client.modules.lang.errors.noAdmin),
          ],
        })
        .then((m) => {
          setTimeout(() => {
            m.channel.messages.fetch().then(() => {
              msg.delete();
              m.delete();
            });
          }, 15000);
        });

    if (cmd.cooldown.has(msg.author.id)) {
      embed.setTitle("Cool-down");
      embed.setDescription(this.client.modules.lang.errors.onCooldown);
      msg.channel.send({
        embeds: [embed],
      });
      return;
    }

    cmd.setMessage(msg);
    await cmd.run(msg, args);

    if (cmd.info.cooldown > 0) cmd.startCooldown(msg.author.id);
  }
}

module.exports = MessageCreate;
