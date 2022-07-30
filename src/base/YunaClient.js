let { Client, Partials, Collection } = require("discord.js");
let fs = require("fs");
let typings = require("../functions/typings");
let YunaGiveawayManager = require("./YunaGiveawayManager");

/**
 * The Client of the Yuna-Bot
 */
class YunaClient extends Client {
  constructor() {
    super({
      intents: 38575,
      partials: [
        Partials.Channel,
        Partials.Reaction,
        Partials.Message,
        Partials.User,
        Partials.GuildMember,
      ],
    });

    /**
     * Collection of Commands for the Yuna Bot
     * @type Collection<String, any>
     */
    this.command = new Collection();

    /**
     * Collection of command aliases for the Yuna Bot
     * @type Collection<String, any>
     */
    this.aliases = new Collection();

    /**
     * All modules which Yuna have.
     */
    this.modules = {
      typings: new typings(),
      lang: null,
      reactionRole: require("../functions/reactionRoles"),
      version: require("../../package.json").version,
    };

    /**
     * Local map for the reaction roles.
     * @type Map<String, Object>
     */
    this.reactionMap = new Map();

    /**
     * Local map for the Reaction Roles in a guild.
     * @type Map<String, Object>
     */
    this.guildReactions = new Map();

    /**
     * Yuna config file.
     */
    this.settings = require("../settings");

    /**
     * Yuna's giveaway manager
     */
    this.giveawayManager = new YunaGiveawayManager();
  }

  /**
   * Login with your discord bot token.
   * @param {string} token Discord Bot Token.
   */
  login(token) {
    super.login(token);
    return this;
  }

  /**
   * Load all commands in their folders.
   * @param {string} path Main command folder where the underfolders are.
   */
  loadCommands(path) {
    fs.readdir(path, (err, folders) => {
      if (err) return console.error(err);
      folders.forEach((folder) => {
        fs.readdir(`${path}/${folder}`, (err, files) => {
          if (err) console.error(err);
          files.forEach((file) => {
            if (!file.endsWith(".js")) return;
            let cmd = new (require(`../command/${folder}/${file}`))(this);
            cmd.info.category = folder;
            cmd.info.name = file.split(".")[0];

            this.command.set(cmd.info.name, cmd);
            if (cmd.info.aliases)
              cmd.info.aliases.forEach((a) => this.aliases.set(a, cmd));
          });
          console.log(
            `[CommandHandler] The category ${folder} was loaded with ${
              files.filter((f) => f.endsWith(".js")).length
            } commands.`
          );
        });
      });
    });
    return this;
  }

  /**
   * Load all events in their folder.
   * @param {String} path The folder where the event files are located.
   */
  loadEvents(path) {
    fs.readdir(path, (err, files) => {
      if (err) console.error(err);
      files.forEach((file) => {
        let event = new (require(`../events/${file}`))(this);
        super.on(file.split(".")[0], (...args) => event.run(...args));
      });
      console.log(
        `[EventHandler] ${
          files.filter((f) => f.endsWith(".js")).length
        } events was loaded.`
      );
    });
    return this;
  }
}

module.exports = YunaClient;
