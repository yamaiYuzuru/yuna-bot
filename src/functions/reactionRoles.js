let { Message, ChannelType } = require("discord.js");
const YunaClient = require("../base/YunaClient");

let { reactionRolesSchema } = require("../Models");
class react {
  /**
   * @param {YunaClient} [client]
   * @param {Message} msg
   * @param {string} [guildId]
   * @param {string} [msgid]
   * @param {string} [roleid]
   * @param {string} [emoji]
   */

  static async createrr(client, msg, guildId, msgid, roleid, emoji) {
    const issame = await reactionRolesSchema.findOne({
      guildID: guildId,
      msgID: msgid,
      reaction: emoji,
      roleID: roleid,
    });
    if (issame) return false;

    const newRR = await reactionRolesSchema.create({
      guildID: guildId,
      msgID: msgid,
      reaction: emoji,
      roleID: roleid,
    });

    await newRR
      .save()
      .catch((e) => console.log(`Failed to create reaction role: ${e}`));
    client.reactionMap.set(`${msgid}_${emoji}`, {
      guildid: guildId,
      msgid: msgid,
      reaction: emoji,
      roleid: roleid,
    });

    msg.guild.channels.cache.map((ch) => {
      if (ch.type !== ChannelType.GuildText) return;
      ch.messages.cache.get(msgid).react(emoji);
    });
    return newRR;
  }

  /**
   * @param {YunaClient} [client]
   * @param {Message} msg
   * @param {string} [guildId]
   * @param {string} [msgid]
   * @param {string} [emoji]
   */
  static async deleterr(client, msg, guildId, msgid, emoji) {
    const reactionRole = await reactionRolesSchema.findOne({
      guildID: guildId,
      msgID: msgid,
      reaction: emoji,
    });
    if (!reactionRole) return false;

    await reactionRolesSchema
      .findOneAndDelete({ guildID: guildId, msgID: msgid, reaction: emoji })
      .catch((e) => console.log(`Failed to reaction: ${e}`));

    client.reactionMap.delete(`${msgid}_${emoji}`);
    msg.guild.channels.cache.map(async (ch) => {
      if (ch.type !== ChannelType.GuildText) return;
      await (await ch.messages.cache.get(msgid).react(emoji)).remove();
    });
    return reactionRole;
  }

  /**
   * @param {YunaClient} [client]
   * @param {string} [guildId]
   * @param {string} [msgid]
   * @param {string} [newroleid]
   * @param {string} [emoji]
   */
  static async editrr(client, guildId, msgid, newroleid, emoji) {
    const reactionRole = await reactionRolesSchema.findOne({
      guildID: guildId,
      msgID: msgid,
      reaction: emoji,
    });
    if (!reactionRole) return false;
    reactionRole.roleID = newroleid;

    await reactionRole
      .save()
      .catch((e) => console.log(`Failed to save new prefix: ${e}`));
    client.reactionMap.set(`${msgid}_${emoji}`, {
      guildid: guildId,
      msgid: msgid,
      reaction: emoji,
      roleid: newroleid,
    });
    return;
  }

  /**
   * @param {YunaClient} [client]
   * @param {string} [guildId]
   * @param {string} [msgid]
   * @param {string} [emoji]
   */

  static async fetchrr(client, guildId, msgid, emoji) {
    if (!client.guildReactions.has(guildId)) {
      let allrole = await reactionRolesSchema
        .find({ guildID: guildId })
        .sort([["guildID", "descending"]])
        .exec();
      let i = 0;
      for (i; i < Object.keys(allrole).length; i++) {
        client.reactionMap.set(`${allrole[i].msgID}_${allrole[i].reaction}`, {
          guildid: allrole[i].guildID,
          msgid: allrole[i].msgID,
          reaction: allrole[i].reaction,
          roleid: allrole[i].roleID,
        });
      }
      client.guildReactions.set(guildId, {
        guildid: guildId,
        totalreactions: Object.keys(allrole).length,
      });
    }
    return client.reactionMap.get(`${msgid}_${emoji}`);
  }

  /**
   * @param {YunaClient} [client]
   */
  static async fetchallrr(client) {
    let all = await serverset
      .find({})
      .sort([["guildID", "descending"]])
      .exec();

    /*   let i = 0;
      for(i ; i < Object.keys(all).length; i++){
        client.react.set(all[i].msgid+all[i].reaction, { ///this saves the msgid in a map to prevent a fetch
          guildID: all[i].guildID,
          msgid: all[i].msgid, 
          reaction: all[i].reaction , 
          roleid: all[i].roleid,
          dm: all[i].dm
        }); 
      }*/

    return all;
  }
}

module.exports = react;
