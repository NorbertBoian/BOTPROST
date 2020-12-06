import ytpl from "ytpl";
import ytdl from "discord-ytdl-core";
export const getPlaylistData = async (playlistURL, maxSongs = 30) => {
  const playlistData = await ytpl(playlistURL, { limit: maxSongs });
  const songsData = playlistData.items;
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
    songsDuration: item.duration,
    songURLs: item.url,
    songTitles: item.title,
    songChannels: item.author.name,
  }));

  return playlistDataObject;
};
