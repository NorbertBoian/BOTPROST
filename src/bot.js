import dotenv from "dotenv";
import Discord from "discord.js";
const client = new Discord.Client();
import ytdl from "ytdl-core";
import ytpl from "ytpl";
dotenv.config();
client.login(process.env.TOKEN);
var py;
ytpl("PL36384B2DAC7D315B")
  .then((playlist) => {
    py = playlist.items;
  })
  .catch((err) => {
    console.error(err);
  });

client.on("message", async (message) => {
  if (message.author.bot || !message.content.startsWith(process.env.PREFIX))
    return; //verificam sa nu fie bot si sa fie process.env.PREFIXul

  const args = message.content.slice(process.env.PREFIX.length).split(" "); // despartim dupa spatiu

  switch (args[0].toLowerCase()) {
    case "ping":
      message.channel.send("pong!").catch(console.error);
      break;
    case "join":
      if (message.member.voice.channel) {
        let index = 0;
        const connection = await message.member.voice.channel.join();
        const dispatcher = connection.play(
          ytdl(py[index].url, {
            filter: "audioonly",
          })
        );
        dispatcher.on("finish", () => {
          index++;
          const dispatcher = connection.play(
            ytdl(py[index].url, {
              filter: "audioonly",
            })
          );
        });
      } else {
        message.reply("You need to join a voice channel first!");
      }
      break;
  }
});
