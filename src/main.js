let YunaClient = require("./base/YunaClient");
require("dotenv").config();

let client = new YunaClient();

client.loadCommands("./src/command");
client.loadEvents("./src/events");

client.login(process.env.TOKEN);
