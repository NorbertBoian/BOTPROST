import ytpl from "ytpl";
import getArtistTitle from "get-artist-title";
import LastFM from "last-fm";
import { cleanUpTitle } from "./cleanUpTitle";
import stringSimilarity from "string-similarity";
const lastfm = new LastFM(process.env.LASTFM_API_KEY, {
  userAgent: "DiscordBot",
});
export const getSongsInfo = async (playlistURL, maxSongs = 30) => {
  try {
    const playlistData = await ytpl(playlistURL, { limit: maxSongs });
    const songsData = playlistData.items;
    const songsDuration = songsData.map((item) => item.duration);
    const songURLs = songsData.map((item) => item.url);
    const songTitles = songsData.map((item) => item.title);
    const songChannels = songsData.map((item) => item.author.name);
    const LastFmPromises = songTitles.map(
      (title, i) =>
        new Promise((resolve, reject) => {
          const cleanedTitle = cleanUpTitle(title);
          const getArtistTitleResult = getArtistTitle(cleanedTitle);
          const badTitle = getArtistTitleResult
            ? getArtistTitleResult
            : [cleanUpTitle(songChannels[i]), title];
          // console.log(getArtistTitleResult);
          //   console.log(artistTitle, "//////", cleanedTitle);
          const [badArtistName, badName] = badTitle;
          const q = `${badArtistName} ${badName}`;
          console.log(q);
          lastfm.trackSearch({ q }, (err, data) => {
            if (err) reject("The API returned an error.Search");
            else {
              if (data.result.length <= 0) {
                reject(`${i} ${q} The API returned an error.No result`);
              } else {
                const artistNames = data.result.map(
                  (result) => result.artistName
                );
                // console.log(badArtistName, artistNames);
                const chosenResult = artistNames.findIndex((artistName) => {
                  return (
                    stringSimilarity.compareTwoStrings(
                      artistName.toLowerCase(),
                      badArtistName.toLocaleLowerCase()
                    ) > 0.4
                  );
                });
                if (chosenResult < 0) reject("No result");
                else {
                  const { name, artistName } =
                    badArtistName !== "Jamala"
                      ? data.result[chosenResult]
                      : { name: "1947", artistName: "Jamala" };
                  lastfm.trackInfo({ name, artistName }, (err, infoResult) => {
                    if (err) reject("The API returned an error.info");
                    else {
                      const cleanName = cleanUpTitle(name);
                      const albumArtwork = infoResult.images
                        ? infoResult.images[infoResult.images.length - 1]
                        : undefined;
                      const songInfo = {
                        name: cleanName,
                        artistName,
                        url: songURLs[i],
                        answers: [
                          cleanName,
                          artistName,
                          `${cleanName} ${artistName}`,
                          `${artistName} ${cleanName}`,
                        ],
                        thumbnail: albumArtwork,
                        duration: songsDuration[i],
                      };
                      resolve(songInfo);
                    }
                  });
                }
              }
            }
          });
        })
    );
    const LastFmResults = await Promise.all(
      LastFmPromises.map((promise) => promise.catch((error) => error))
    );
    const songsInfo = LastFmResults.filter((result) => result);
    return songsInfo;
  } catch (error) {
    console.log(error);
  }
};
