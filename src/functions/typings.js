const { Role } = require("discord.js");

class typings {
  /**
   * Get a role id
   * @param {Role | String} role
   */
  RoleID_RoleToID = function (role) {
    if (role.id) return role.id;
    return role;
  };

  /**
   * Convert Days, Hours and Minutes into Milliseconds
   * @param {Object} timeOptions
   * @param {Number} timeOptions.d
   * @param {Number} timeOptions.h
   * @param {Number} timeOptions.m
   */
  timeInMS = function (timeOptions) {
    let dayInMS = timeOptions.d * 24 * 60 * 60 * 1000;
    let hourInMS = timeOptions.h * 60 * 60 * 1000;
    let minuteInMS = timeOptions.m * 60 * 1000;
    if (d && h && m) {
      return Math.floor(dayInMS + hourInMS + minuteInMS);
    } else if (d && h) {
      return Math.floor(dayInMS + hourInMS);
    } else if (d && m) {
      return Math.floor(dayInMS + minuteInMS);
    } else if (h && m) {
      return Math.floor(hourInMS + minuteInMS);
    } else if (d) {
      return Math.floor(dayInMS);
    } else if (h) {
      return Math.floor(hourInMS);
    } else if (m) {
      return Math.floor(minuteInMS);
    }
  };
}

module.exports = typings;
