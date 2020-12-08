import getArtistTitle from "get-artist-title";
import { cleanUpTitle } from "./cleanUpTitle";
import stringSimilarity from "string-similarity";
import DeezerPublicApi from "deezer-public-api";
import { getBadTitle } from "./getBadTitle";
import { getFeaturedArtistsFromTitle } from "./getFeaturedArtistsFromTitle";
const deezer = new DeezerPublicApi();

export const searchDeezer = async ({
  songsDuration,
  songURLs,
  songTitles,
  songChannels,
}) => {
  getFeaturedArtistsFromTitle("artistName", "name");
  return;
  // console.log(await deezer.infos());
  const deezerPromises = songTitles.map(async (title, i) => {
    const [badArtistName, badName] = getBadTitle(title, songChannels[i]);
    const query = `${badArtistName} ${badName}`;
    const searchResult = await deezer.search.track(query, "RANKING", 200);
    const searchResultData = searchResult.data;
    const artistNames = searchResultData.map(
      (songData) => songData.artist.name
    );
    const artistSimilarEnoughFfilter = (artistName) => {
      return (
        stringSimilarity.compareTwoStrings(
          artistName.toLowerCase(),
          badArtistName.toLowerCase()
        ) > 0.6
      );
    };
    // .some from array of artists from badartist
    const chosenResultIndex = artistNames.findIndex(artistSimilarEnoughFfilter);

    if (chosenResultIndex < 0) return "No result";
    else {
      const name = searchResultData.result[chosenResultIndex].title_short;
      const artistName = searchResultData.result[chosenResultIndex].artist.name;
      const albumArtwork =
        searchResultData.result[chosenResultIndex].album.cover_medium;
      const trackId = searchResultData.result[chosenResultIndex].id;
      const trackInfo = await deezer.track(trackId);
      const trackContributors = trackInfo.contributors;
      const isFeaturedArtist = (contributor) =>
        contributor.type === "artist" && contributor.role !== "Main";
      const featuredArtistsData = trackContributors.filter(isFeaturedArtist);
      const featuredArtistsNamesLastFM = featuredArtistsData.map(
        (featuredArtistData) => featuredArtistsData.name
      );
      const featuredArtistsNames = featuredArtistsNamesLastFM.length
        ? featuredArtistsNamesLastFM
        : getFeaturedArtistsFromTitle(artistName, name);
      const cleanName = cleanUpTitle(name);

      const songInfo = {
        name,
        artistName,
        featuredArtistsNames,
        url: songURLs[i],
        thumbnail: albumArtwork,
        duration: songsDuration[i],
      };
    }
  });
};
//
//             else {
//               const { name, artistName } =
//                 badArtistName !== "Jamala"
//                   ? data.result[chosenResult]
//                   : { name: "1947", artistName: "Jamala" };
//               lastfm.trackInfo({ name, artistName }, (err, infoResult) => {
//                 if (err) {
//                   if (i === 2) console.log(err, name, artistName);
//                   reject("The API returned an error.info");
//                 } else {
//                   const cleanName = cleanUpTitle(name).replace(
//                     /(Ft\.).*|(Featuring\.).*|(ft\.).*|(featuring\.).*|(feat\.).*|(Feat\.).*/g,
//                     ""
//                   );
//                   const albumArtwork = infoResult.images
//                     ? infoResult.images[infoResult.images.length - 1]
//                     : undefined;
//                   const songInfo = {
//                     name: cleanName,
//                     artistName,
//                     url: songURLs[i],
//                     answers: [
//                       cleanName,
//                       artistName,
//                       `${cleanName} ${artistName}`,
//                       `${artistName} ${cleanName}`,
//                     ],
//                     thumbnail: albumArtwork,
//                     duration: songsDuration[i],
//                   };
//                   resolve(songInfo);
//                 }
//               });
//             }
//           }
//         }
//       });
//     }
// ;
// const LastFmResults = await Promise.all(
//   LastFmPromises.map((promise) => promise.catch((error) => error))
// );
// const songsInfo = LastFmResults.filter((result) => result);
// return songsInfo;
