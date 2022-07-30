let { GiveawaysManager } = require("discord-giveaways");
let { giveawaySchema } = require("../Models");
const YunaClient = require("./YunaClient");
let client = new YunaClient();

class YunaGiveawayManager extends GiveawaysManager {
  constructor() {
    super(client, {
      default: {
        botsCanWin: false,
        embedColor: "#311c73",
        embedColorEnd: "#6650d4",
        reaction: "🎉",
      },
    });
  }

  async getAllGiveaways() {
    let allGiveaways = await giveawaySchema.find().lean().exec();
    return allGiveaways;
  }

  async saveGiveaway(giveawayData) {
    await giveawaySchema.create(giveawayData).save();

    return true;
  }

  async editGiveaway(msgID, giveawayData) {
    await giveawaySchema.updateOne({ messageId: msgID }, giveawayData).exec();

    return true;
  }

  async deleteGiveaway(msgID) {
    await giveawaySchema.deleteOne({ messageId: msgID }).exec();

    return true;
  }
}

module.exports = YunaGiveawayManager;
