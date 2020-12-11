import { getPlaylistData } from "./getPlaylistData";
import { searchDeezer } from "./searchDeezer";
export const getSongsInfo = async (playlistURL, maxSongs = 30) => {
  try {
    if (playlistURL) {
      const playListData = await getPlaylistData(
        playlistURL,
        maxSongs + Math.max(maxSongs * 0.5, 40)
      );
      // const songsInfo = await searchLastFM(playListData);
      const getSongsInfoFunctions = searchDeezer(playListData);
      return getSongsInfoFunctions;
    } else return false;
  } catch (error) {
    console.log(error);
  }
};
