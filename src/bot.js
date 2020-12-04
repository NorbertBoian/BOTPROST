import dotenv from "dotenv";
import Discord from "discord.js";
const client = new Discord.Client();
dotenv.config();
import { play } from "./controllers/play/play";
import { quiz } from "./controllers/quiz/quiz";
import { playlistURL } from "./controllers/quiz/quizExports";
import { getSongsInfo } from "./controllers/quiz/functions/getSongsInfo";
const start = async () => {
  try {
    client.on("message", async (message) => {
      try {
        //  verificam sa nu fie bot si sa fie prefix
        if (
          message.author.bot ||
          !message.content.startsWith(process.env.PREFIX)
        )
          return;
        // despartim dupa spatiu
        const args = message.content
          .slice(process.env.PREFIX.length)
          .split(" ");
        const memberVoiceChannel = message.member.voice.channel;
        const memberTextChannel = message.channel;
        switch (args[0].toLowerCase()) {
          case "ping":
            await memberTextChannel.send("pong!");
            break;
          case "join":
            await memberVoiceChannel.join();
            break;
          case "leave":
            await memberVoiceChannel.leave();
            break;
          case "play":
            play(args, message);
            break;
          case "quiz":
            quiz(args, message, songsInfo);
            break;
        }
      } catch (error) {
        console.error(error);
      }
    });

    await client.login(process.env.TOKEN);
    let songsInfo = await getSongsInfo(playlistURL);
    // console.log(songsInfo);
    console.log("Running");
  } catch (error) {
    console.log(error);
  }
};
start();
