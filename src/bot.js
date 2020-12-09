import dotenv from "dotenv";
import Discord from "discord.js";
const client = new Discord.Client();
dotenv.config();
import { play } from "./controllers/play/play";
import { quiz } from "./controllers/quiz/quiz";
import { defaultPlaylistURL } from "./controllers/quiz/quizExports";
import { getSongsInfo } from "./controllers/quiz/functions/getSongsInfo";
import KeyvFile, { makeField } from "keyv-file";
class Kv extends KeyvFile {
  constructor() {
    super({
      filename: "./db/db.json",
    });
  }
  prefix = makeField(this, "field_key");
}
export const kv = new Kv();
const start = async () => {
  try {
    let maxSongs = 30;
    let prefix = (await kv.prefix.get()) ? kv.prefix.get() : process.env.PREFIX;
    client.on("message", async (message) => {
      try {
        //  verificam sa nu fie bot si sa fie prefix
        if (message.author.bot || !message.content.startsWith(prefix)) return;
        // despartim dupa spatiu
        const args = message.content.slice(prefix.length).split(" ");
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
            quiz(args, message, playlistURL, maxSongs, prefix);
            break;
          case "quizpl":
            if (args[1]) {
              playlistURL = args[1];
              await memberTextChannel.send("Playlist has been updated.");
            } else await memberTextChannel.send("Invalid URL.");
            break;
          case "quizmax":
            {
              maxSongs = +args[1];
              await memberTextChannel.send(
                "Maximum number of songs in quiz has been updated."
              );
            }
            break;
          case "setprefix":
            await kv.prefix.set(args[1]);
            prefix = args[1];
            await memberTextChannel.send("Prefix has been set");
            break;
          case "prefix":
            {
              const currentPrefix = await kv.prefix.get();
              await memberTextChannel.send(
                `Current prefix is ${currentPrefix}`
              );
            }
            break;
        }
      } catch (error) {
        console.error(error);
      }
    });
    let playlistURL = defaultPlaylistURL;
    await client.login(process.env.TOKEN);
    // console.log(songsInfo);
    console.log("Running");
  } catch (error) {
    console.log(error);
  }
};
start();
