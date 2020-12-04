import ytpl from "ytpl";
import { playSong } from "./functions/playSong";
import { playSongs } from "./functions/playSongs";

export const play = async (args, message) => {
  try {
    const memberVoiceChannel = message.member.voice.channel;
    const connection = await memberVoiceChannel.join();
    const url = args[1];
    const isPlaylist = url.includes("list=");
    if (isPlaylist) {
      const playlistData = await ytpl(url);
      const songsData = playlistData.items;
      const songURLs = songsData.map((item) => item.url);
      playSongs(songURLs, connection);
    } else {
      playSong(url, connection);
    }
  } catch (error) {
    console.log(error);
  }
};
