import dotenv from "dotenv";
import Discord from "discord.js";
const client = new Discord.Client();
import ytdl from "ytdl-core";
import ytpl from "ytpl";
dotenv.config();
console.log("Running");

// var py;
// ytpl("PL36384B2DAC7D315B")
//   .then((playlist) => {
//     py = playlist.items;
//   })
//   .catch((err) => {
//     console.error(err);
//   });

client.on("message", async (message) => {
  try {
    if (message.author.bot || !message.content.startsWith(process.env.PREFIX))
      return; //verificam sa nu fie bot si sa fie prefix

    const args = message.content.slice(process.env.PREFIX.length).split(" "); // despartim dupa spatiu
    const memberVoiceChannel = message.member.voice.channel;
    const memberTextChannel = message.channel;
    switch (args[0].toLowerCase()) {
      case "ping":
        memberTextChannel.send("pong!");
        break;
      case "join":
        memberVoiceChannel.join();
        break;
      case "leave":
        memberVoiceChannel.leave();
        break;
      case "play":
        const connection = await memberVoiceChannel.join();
        const url = args[1];
        if (url.includes("list")) {
          const response = await ytpl(url);
          const items = response.items;
          const urls = items.map((item) => item.url);
          const finish = () => {
            urls.shift();
            play();
          };
          const play = () => {
            console.log(urls[0]);
            const dispatcher = connection.play(
              ytdl(urls[0], {
                filter: "audioonly",
              })
            );
            dispatcher.on("finish", finish);
          };
          play();
        } else {
          connection.play(
            ytdl(url, {
              filter: "audioonly",
            })
          );
        }
        break;
    }
  } catch (error) {
    console.error(error);
  }
});

client.login(process.env.TOKEN);
