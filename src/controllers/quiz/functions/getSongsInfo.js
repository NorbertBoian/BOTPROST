import ytpl from "ytpl";
import getArtistTitle from "get-artist-title";
import LastFM from "last-fm";
import { cleanUpTitle } from "./cleanUpTitle";
const lastfm = new LastFM(process.env.LASTFM_API_KEY, {
  userAgent: "DiscordBot",
});
export const getSongsInfo = async (playlistURL) => {
  try {
    const playlistData = await ytpl(playlistURL);
    const songsData = playlistData.items;
    const songsDuration = songsData.map((item) => item.duration);
    const songURLs = songsData.map((item) => item.url);
    const songTitles = songsData.map((item) => item.title);
    const LastFmPromises = songTitles.map(
      (title, i) =>
        new Promise((resolve, reject) => {
          const artistTitle = getArtistTitle(cleanUpTitle(title));
          if (artistTitle) {
            const [artistName, name] = artistTitle;
            lastfm.trackInfo({ name, artistName }, (err, infoResult) => {
              if (err) reject("The API returned an error.");
              else {
                const albumArtwork = infoResult.images
                  ? infoResult.images[infoResult.images.length - 1]
                  : undefined;
                const data = {
                  name,
                  artistName,
                  url: songURLs[i],
                  answers: [
                    name,
                    artistName,
                    `${name} ${artistName}`,
                    `${artistName} ${name}`,
                  ],
                  thumbnail: albumArtwork,
                  duration: songsDuration[i],
                };
                resolve(data);
              }
            });
          } else resolve(false);
        })
    );
    const LastFmResults = await Promise.all(LastFmPromises);
    const songsInfo = LastFmResults.filter((result) => result);
    return songsInfo;
  } catch (error) {
    console.log(error);
  }
};
