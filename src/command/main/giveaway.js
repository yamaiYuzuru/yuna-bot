let YunaClient = require("../../base/YunaClient");
let Command = require("../../base/Command");
let { Message, EmbedBuilder } = require("discord.js");

class Giveaway extends Command {
  /**
   * @param {YunaClient} client
   */
  constructor(client) {
    super(client, {
      description: "Create or end an giveaway.",
      usage:
        "y!giveaway create <channel> <duration (e.g. 2d3h20ms)> <prize> <winner(s)>\ny!giveaway end <msgID>",
      cooldown: 10000,
    });
    this.client = client;
  }

  /**
   * @param {Message} msg
   * @param {String[]} args
   */
  async run(msg, args) {
    let embed = new EmbedBuilder().setColor("Fuchsia").setTimestamp(Date.now());
    if (
      !msg.member.roles.cache.find((r) => r.name === "Giveaway") ||
      !msg.member.permissions.has("ManageGuild")
    )
      return this.respond({
        embeds: [
          embed.setDescription(this.client.modules.lang.errors.noGiveaway),
        ],
      });
    switch (args[0]) {
      case "create":
        let channel = msg.mentions.channels.first(),
          duration = args[2],
          prize = args[3],
          winners = args[4];
        let d = duration.split("d")[0],
          h = duration.split("h")[0],
          m = duration.split("m")[0];

        let time = 0;
        if (d && h && m) {
          time = this.client.modules.typings.timeInMS({ d: d, h: h, m: m });
        } else if (d && h) {
          time = this.client.modules.typings.timeInMS({ d: d, h: h });
        } else if (d && m) {
          time = this.client.modules.typings.timeInMS({ d: d, m: m });
        } else if (h && m) {
          time = this.client.modules.typings.timeInMS({ h: h, m: m });
        } else if (d) {
          time = this.client.modules.typings.timeInMS({ d: d });
        } else if (h) {
          time = this.client.modules.typings.timeInMS({ h: h });
        } else if (m) {
          time = this.client.modules.typings.timeInMS({ m: m });
        }
        if (!channel || !duration || !prize || !winners)
          return this.respond({
            embeds: [
              embed.setDescription(
                `${
                  channel
                    ? this.client.modules.lang.giveaway.create.channel.replace(
                        "%channel%",
                        `<#${channel.id}>`
                      )
                    : this.client.modules.lang.errors.noChannel
                } ${
                  duration
                    ? this.client.modules.lang.giveaway.create.duration.replace(
                        "%duration%",
                        `<t:${time}:R>`
                      )
                    : this.client.modules.lang.errors.noDuration
                } ${
                  prize
                    ? this.client.modules.lang.giveaway.create.prize.replace(
                        "%prize%",
                        prize
                      )
                    : this.client.modules.lang.errors.noPrize
                } ${
                  winners
                    ? this.client.modules.lang.giveaway.create.winners.replace(
                        "%winners%",
                        winners
                      )
                    : this.client.modules.lang.errors.noWinners
                }`
              ),
            ],
          });
        this.client.giveawayManager.start(channel, {
          prize: prize,
          duration: time,
          winnerCount: winners,
          hostedBy: msg.author,
        });
        break;
      case "end":
        if (!args[1])
          return this.respond({
            embeds: [
              embed.setDescription(this.client.modules.lang.errors.noMsgID),
            ],
          });
        this.client.giveawayManager.end(args[1]);
        this.respond({
          embeds: [
            embed.setDescription(
              this.client.modules.lang.giveaway.end.msg.replace("%id%", args[1])
            ),
          ],
        });
    }
  }
}

module.exports = Giveaway;
