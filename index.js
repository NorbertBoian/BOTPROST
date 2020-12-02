const { PREFIX, TOKEN } = require("./config.json");
const Discord = require("discord.js");
const ytdl = require("ytdl-core");
var ytpl = require("ytpl");
const client = new Discord.Client();
client.login(TOKEN);

let py = ytpl("PLuXpx63rTncIzz0yJLyE7lTSUo2lBnqrl")
  .then((playlist) => {
    console.log(playlist);
  })
  .catch((err) => {
    console.error(err);
  });

client.on("message", async (message) => {
  if (message.author.bot || !message.content.startsWith(PREFIX)) return; //verificam sa nu fie bot si sa fie prefixul

  const args = message.content.slice(PREFIX.length).split(" "); // despartim dupa spatiu

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
