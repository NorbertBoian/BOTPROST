import dotenv from "dotenv";
import Discord from "discord.js";
import ytdl from "ytdl-core";
const client = new Discord.Client();
dotenv.config();
client.login(procces.env.TOKEN);

client.on("message", async (message) => {
  if (message.author.bot || !message.content.startsWith(procces.env.PREFIX))
    return; //verificam sa nu fie bot si sa fie prefixul

  const args = message.content.slice(procces.env.PREFIX.length).split(" "); // despartim dupa spatiu

  switch (args[0].toLowerCase()) {
    case "ping":
      message.channel.send("pong!").catch(console.error);
      break;
    case "join":
      if (message.member.voice.channel) {
        const connection = await message.member.voice.channel.join();
        const dispatcher = connection.play(
          ytdl("https://www.youtube.com/watch?v=H9154xIoYTA", {
            filter: "audioonly",
          })
        );
      } else {
        message.reply("You need to join a voice channel first!");
      }
      break;
  }
});
