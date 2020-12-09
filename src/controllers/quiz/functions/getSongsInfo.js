import { getPlaylistData } from "./getPlaylistData";
import { searchDeezer } from "./searchDeezer";
import { searchLastFM } from "./searchLastFM";
export const getSongsInfo = async (playlistURL, maxSongs = 30) => {
  try {
    if (playlistURL) {
      const playListData = await getPlaylistData(playlistURL, maxSongs);
      // const songsInfo = await searchLastFM(playListData);
      const songsInfo = await searchDeezer(playListData);
      return songsInfo;
    } else return false;
  } catch (error) {
    console.log(error);
  }
};

const quiz = async () => {
  const shuffledGetSongsInfoFunctions = Array.from(
    { length: 10 },
    (a, i) => () => new Promise((resolve) => setTimeout(resolve, 100))
  );
  const songsInfo = [];
  // console.log("first" + songsInfo);
  const didGameEnd = false;
  const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
  const getSongInfo = async () => {
    const index = songsInfo.length;
    const songInfo = await shuffledGetSongsInfoFunctions[index]();
    songsInfo.push(songInfo);
    // console.log("second" + songsInfo);
    if (index - 1 < shuffledGetSongsInfoFunctions.length && !didGameEnd) {
      await wait(300);
      getSongInfo();
    }
  };
  console.log("10");
  getSongInfo();
  console.log("5");
  console.log(songsInfo);
  await wait(200);
  console.log(songsInfo);
  await wait(200);
  console.log(songsInfo);
  await wait(200);
  console.log(songsInfo);
  await wait(200);
  console.log(songsInfo);
  await wait(200);
  console.log(songsInfo);
  await wait(200);
  console.log(songsInfo);
  await wait(200);
  console.log(songsInfo);
  await wait(200);
  console.log(songsInfo);
};
