import { getPlaylistData } from "./getPlaylistData";
import { searchDeezer } from "./searchDeezer";
import { searchLastFM } from "./searchLastFM";
export const getSongsInfo = async (playlistURL, maxSongs = 30) => {
  try {
    if (playlistURL) {
      const playListData = await getPlaylistData(playlistURL, maxSongs);
      // const songsInfo = await searchLastFM(playListData);
      await searchDeezer(playListData);
      // return songsInfo;
    } else return false;
  } catch (error) {
    console.log(error);
  }
};
