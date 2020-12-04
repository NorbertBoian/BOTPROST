import dotenv from "dotenv";
import Discord from "discord.js";
const client = new Discord.Client();
import ytdl from "ytdl-core";
import ytpl from "ytpl";
import stringSimilarity from "string-similarity";
dotenv.config();
console.log("Running");
let isQuiz = false;
let players;
let nowPlaying;

client.on("message", async (message) => {
  try {
    if (
      message.author.bot ||
      !message.content.startsWith(process.env.PREFIX) ||
      isQuiz
    )
      return; //verificam sa nu fie bot sau sa fie prefix
    if (isQuiz && !message.content.startsWith(process.env.PREFIX)) {
      const string = message.content.toLowerCase();
      return;
    }
    if (message.content.startsWith(process.env.PREFIX)) {
      console.log("aici");
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
          // const connection = await memberVoiceChannel.join();
          // const url = args[1];
          // if (url.includes("list")) {
          //   const response = await ytpl(url);
          //   const items = response.items;
          //   const urls = items.map((item) => item.url);
          //   const finish = () => {
          //     urls.shift();
          //     play();
          //   };
          //   const play = () => {
          //     console.log(urls[0]);
          //     const dispatcher = connection.play(
          //       ytdl(urls[0], {
          //         filter: "audioonly",
          //       })
          //     );
          //     dispatcher.on("finish", finish);
          //   };
          //   play();
          // } else {
          //   connection.play(
          //     ytdl(url, {
          //       filter: "audioonly",
          //     })
          //   );
          // }
          break;
        case "quiz":
          isQuiz = true;
          players = memberVoiceChannel.members
            .map((guild) => guild.user)
            .filter((user) => !user.bot);
          const connection = await memberVoiceChannel.join();
          const url = args[1];
          if (url.includes("list")) {
            const response = await ytpl(url);
            const items = response.items;
            let index;
            const finish = () => {
              items.splice(index, 1);
              play();
            };
            const play = () => {
              index = Math.floor(Math.random() * items.length);
              nowPlaying = items[index];
              //console.log(urls[index]);
              const dispatcher = connection.play(
                ytdl(items[index].url, {
                  filter: "audioonly",
                })
              );
              dispatcher.on("finish", finish);
            };
            play();
          } else {
            memberTextChannel.send("trebe playlist bo$$");
          }
          break;
        default:
          memberTextChannel.send("nu stiu deastea bo$$");
          break;
      }
    }
  } catch (error) {
    console.error(error);
  }
});

client.login(process.env.TOKEN);
