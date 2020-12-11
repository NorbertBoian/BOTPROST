import ytpl from "ytpl";
import ytdl from "discord-ytdl-core";
import { shuffleArray } from "./shuffleArray";
export const getPlaylistData = async (playlistURL, maxSongs = 30) => {
  const playlistData = await ytpl(playlistURL, { limit: Infinity });
  const unshuffledSongsData = playlistData.items;
  const shuffledSongsData = shuffleArray(unshuffledSongsData);
  const songsData = shuffledSongsData.slice(0, maxSongs);
  const songsMeta = await Promise.all(
    songsData.map((songData) => ytdl.getInfo(songData.url))
  );
  const isPlayableFilter = (songData, i) => {
    const isPlayable =
      songsMeta[i].player_response.playabilityStatus.status === "UNPLAYABLE"
        ? false
        : true;
    return isPlayable;
  };
  const playableSongsData = songsData.filter(isPlayableFilter);
  const playlistDataObject = playableSongsData.map((item) => ({
    songDuration: item.duration,
    songURL: item.url,
    songTitle: item.title,
    songChannel: item.author.name,
  }));

  return playlistDataObject;
};
