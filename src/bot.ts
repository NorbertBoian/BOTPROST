import dotenv from "dotenv";
import Discord from "discord.js";
const client = new Discord.Client();
dotenv.config();

client.on("ready", () => {
  console.log(`Logged in as ${client.user?.tag}!`);
});

client.on("message", (msg) => {
  if (msg.content === "ping") {
    msg.reply("pong");
  }
});

client.login(process.env.BOT_TOKEN);
