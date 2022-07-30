let YunaClient = require("../../base/YunaClient");
let Command = require("../../base/Command");
let {
  Message,
  SelectMenuBuilder,
  EmbedBuilder,
  ActionRowBuilder,
  ChannelType,
  ComponentType,
} = require("discord.js");

class Help extends Command {
  /**
   * @param {YunaClient} client
   */
  constructor(client) {
    super(client, {
      description: "Shows all commands and information about a command.",
      usage: "y!help [command]",
      cooldown: 250000,
    });
    this.client = client;
  }

  /**
   * @param {Message} msg
   * @param {String[]} args
   */
  async run(msg, args) {
    if (msg.channel.type !== ChannelType.GuildText) return;
    let embed = new EmbedBuilder().setColor("Fuchsia");
    if (args[0]) {
      let cmd =
        this.client.command.get(args[0].toLowerCase()) ||
        this.client.aliases.get(args[0].toLowerCase());
      if (!cmd)
        return this.respond({
          embeds: [
            embed
              .setDescription(this.client.modules.lang.errors.noCMD)
              .toJSON(),
          ],
        });

      embed.setTitle(`y!${cmd.info.name}`);
      embed.setDescription(cmd.info.description);
      embed.setFields([
        {
          name: "Usage",
          value: `\`${cmd.info.usage || `y!${cmd.info.name}`}\``,
        },
      ]);
      embed.setFooter({
        text: this.client.modules.lang.help.usageLegend,
        iconURL: msg.author.displayAvatarURL({ dynamic: true }),
      });
      if (cmd.info.aliases)
        embed.setFields([
          { name: "Aliases", value: `${cmd.info.aliases.join(", ")}` },
        ]);
    }

    let directories = [];
    if (!msg.channel.nsfw) {
      directories.push(
        ...new Set(
          this.client.command
            .sort((cmd) =>
              cmd.info.category.localeCompare(cmd.info.category[0])
            )
            .map((cmd) => cmd.info.category)
            .filter((c) => !hidden_category.some((cc) => c === cc))
            .filter((c) => c !== "nsfw")
        )
      );
    } else {
      directories.push(
        ...new Set(
          this.GuildTextclient.command
            .sort((cmd) =>
              cmd.info.category.localeCompare(cmd.info.category[0])
            )
            .map((cmd) => cmd.info.category)
            .filter((c) => !hidden_category.some((cc) => c === cc))
        )
      );
    }
    let formatString = (str) =>
      `${str[0].toUpperCase()}${str.slice(1).toLowerCase()}`;

    let categories = directories.map((dir) => {
      let getCommands = this.client.command
        .sort((cmd) => cmd.info.name.localeCompare(cmd.info.name[0]))
        .filter((cmd) => cmd.info.category === dir)
        .map((cmd) => {
          return {
            name: cmd.info.name,
            description: cmd.info.description,
          };
        });

      return {
        directory: formatString(dir),
        commands: getCommands,
      };
    });

    const components = (state) => [
      new ActionRowBuilder()
        .addComponents([
          new SelectMenuBuilder()
            .setCustomId("cmd_help_menu")
            .setPlaceholder("Please select a category")
            .setDisabled(state)
            .addOptions(
              categories.map((cmd) => {
                return {
                  label: cmd.directory,
                  value: cmd.directory.toLowerCase(),
                  description: `Commands in the category ${cmd.directory}`,
                  emoji: emojis[cmd.directory.toLowerCase()] || null,
                };
              })
            ),
        ])
        .toJSON(),
    ];

    await this.respond({
      components: components(false),
      embeds: [
        embed
          .setTitle("Categories")
          .setDescription(this.client.modules.lang.help.embedMSG)
          .addFields([
            {
              name: "Bot Links",
              value:
                "• Yuna's Supportserver: [Click me!](https://discord.gg/sakuratree)",
            },
          ])
          .toJSON(),
      ],
    });

    let filter = (interaction) => interaction.user.id === msg.author.id;
    let collector = msg.channel.createMessageComponentCollector({
      filter: filter,
      componentType: ComponentType.SelectMenu,
    });

    collector.on("collect", (i) => {
      let [directory] = i.values;
      let cat = categories.find((x) => x.directory.toLowerCase() === directory);

      embed = new EmbedBuilder();
      embed.setTitle(directory);
      embed.addFields(
        cat.commands.map((cmd) => {
          return {
            name: cmd.name,
            value: cmd.description,
            inline: true,
          };
        })
      );

      i.update({
        embeds: [embed.toJSON()],
      });
    });
  }
}
let hidden_category = ["admin"];
let emojis = {
  fun: "910179218959237150",
  utility: "⚙",
  settings: "🌸",
  main: "🍥",
  moderation: "🚨",
  nsfw: "🔞",
  social: "🤝",
  voice: "916370154089226250",
};

module.exports = Help;
