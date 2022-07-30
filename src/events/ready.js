const YunaClient = require("../base/YunaClient");
let mongoose = require("mongoose");
let { yunaSchema } = require("../Models");

class Ready {
  /**
   * @param {YunaClient} client
   */
  constructor(client) {
    this.client = client;
  }

  async run() {
    console.log(`Online als ${this.client.user.tag}`);

    setInterval(async () => {
      await setPresence(this.client);
    }, 10e3);
    mongoose.connect("mongodb://localhost", {
      dbName: "yuna_bot",
    });
    let yuna = await yunaSchema.findOne({ clientID: this.client.user.id });
    if (!yuna) {
      let newYuna = await yunaSchema.create({
        clientID: this.client.user.id,
        network_guilds: [
          "932762898571358228",
          "886693651282014258",
          "885867123228942336",
        ],
      });
      await newYuna.save();
    }
  }
}

/**
 * @param {YunaClient} client
 */
async function setPresence(client) {
  const statuses = [
    `on ${client.guilds.cache.size} Servers OwO|||PLAYING`,
    "Anime openings on Spotify|||LISTENING",
    "Crunchyroll|||WATCHING",
    `with ${client.command.size} Commands|||PLAYING`,
    `with ${client.users.cache.size} Users UwU|||PLAYING`,
    "on https://gitlab.sakuratree.de|||WATCHING",
    "on https://sakuratree.de/dc|||PLAYING",
    "on https://sakuratree.de/dc/ayako|||PLAYING",
  ];

  const index = Math.floor(Math.random() * (statuses.length - 1) + 1);
  const type = statuses[index].split("|||")[1];
  const name = statuses[index].split("|||")[0];

  return client.user.setPresence({
    activities: [{ name: name + " y!help", type: type }],
    status: "idle",
  });
}

module.exports = Ready;
