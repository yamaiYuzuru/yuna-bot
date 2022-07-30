let YunaClient = require("../../base/YunaClient");
let Command = require("../../base/Command");
let {
  Message,
  EmbedBuilder,
  ButtonBuilder,
  ActionRowBuilder,
  ButtonStyle,
} = require("discord.js");
let { userSchema } = require("../../Models");

class Lang extends Command {
  /**
   * @param {YunaClient} client
   */
  constructor(client) {
    super(client, {
      description: "Change the language for you in this bot.",
      usage: "y!lang",
      cooldown: 250000,
    });
    this.client = client;
  }

  /**
   * @param {Message} msg
   */
  async run(msg) {
    let user = await userSchema.findOne({ userID: msg.author.id });
    if (!user) return;

    let embed = new EmbedBuilder().setColor("Fuchsia");
    embed.setDescription(this.client.modules.lang.language.choose);
    let deButton = new ButtonBuilder()
      .setCustomId("cmd_lang_buttonDe")
      .setLabel("Deutsch")
      .setStyle(ButtonStyle.Secondary);
    let enButton = new ButtonBuilder()
      .setCustomId("cmd_lang_buttonEn")
      .setLabel("English")
      .setStyle(ButtonStyle.Secondary);
    let actionRow = new ActionRowBuilder().setComponents([deButton, enButton]);
    this.respond({ embeds: [embed], components: [actionRow] }).then((m) => {
      let filter = (i) => i.user.id === msg.author.id;

      let collector = m.createMessageComponentCollector({ filter: filter });

      collector.on("collect", async (i) => {
        if (i.customId === "cmd_lang_buttonDe") {
          user.language = "de_DE";
          await user.save();
          m.edit({
            embeds: [
              embed.setDescription(
                this.client.modules.lang.language.changed.replace(
                  "%lang%",
                  "Deutsch"
                )
              ),
            ],
            components: [],
          });
        }
        if (i.customId === "cmd_lang_buttonEn") {
          user.language = "en_US";
          await user.save();
          m.edit({
            embeds: [
              embed.setDescription(
                this.client.modules.lang.language.changed.replace(
                  "%lang%",
                  "English"
                )
              ),
            ],
            components: [],
          });
        }
      });
    });
  }
}

module.exports = Lang;
