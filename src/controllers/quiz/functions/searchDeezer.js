import { cleanUpTitle } from "./cleanUpTitle";
import stringSimilarity from "string-similarity";
import DeezerPublicApi from "deezer-public-api";
import { getSongAndArtistsFromTitle } from "./getSongAndArtistsFromTitle";
const deezer = new DeezerPublicApi();

export const searchDeezer = async ({
  songsDuration,
  songURLs,
  songTitles,
  songChannels,
}) => {
  // console.log(await deezer.infos());

  const deezerPromises = songTitles.map(async (title, i) => {
    const [initialArtistsNames, initialSongName] = getSongAndArtistsFromTitle(
      title,
      songChannels[i]
    );
    const deezerQuery = `${initialArtistsNames.join("")} ${initialSongName}`;
    const searchResult = await deezer.search.track(deezerQuery, "RANKING", 200);
    const searchResultData = searchResult.data;
    const foundArtistsNames = searchResultData.map(
      (songData) => songData.artist.name
    );
    const chooseResultFilter = (foundArtist) => {
      const artistSimilarEnoughFfilter = (artistName) =>
        stringSimilarity.compareTwoStrings(
          artistName.toLowerCase(),
          foundArtist.toLowerCase()
        ) > 0.6;
      return initialArtistsNames.some(artistSimilarEnoughFfilter);
    };
    // .some from array of artists from badartist
    const chosenResultIndex = foundArtistsNames.findIndex(chooseResultFilter);

    if (chosenResultIndex < 0) return "No result";
    else {
      const deezerArtistName =
        searchResultData.result[chosenResultIndex].artist.name;
      const deezerSongName =
        searchResultData.result[chosenResultIndex].title_short;
      const albumArtwork =
        searchResultData.result[chosenResultIndex].album.cover_medium;
      const trackId = searchResultData.result[chosenResultIndex].id;
      const trackInfo = await deezer.track(trackId);
      const trackContributors = trackInfo.contributors;
      const isFeaturedArtist = (contributor) =>
        contributor.type === "artist" && contributor.role !== "Main";
      const featuredArtistsData = trackContributors.filter(isFeaturedArtist);
      const featuredArtistsNames = featuredArtistsData.map(
        (featuredArtistData) => featuredArtistsData.name
      );
      const deezerArtistNames = [deezerArtistName, ...featuredArtistsNames];
      // let [artistsNames, songName] = [deezerArtistNames, deezerSongName];
      // if (!featuredArtistsData.length) {
      const [artistsNames, songName] = getSongAndArtistsFromTitle(
        `${deezerArtistName} - ${deezerSongName}`
      );
      // }
      // const featuredArtistsNamesLastFM = featuredArtistsData.map(
      //   (featuredArtistData) => featuredArtistsData.name
      // );
      // const featuredArtistsNames = featuredArtistsNamesLastFM.length
      //   ? featuredArtistsNamesLastFM
      //   : getFeaturedArtistsFromTitle(artistName, name);
      // const cleanName = cleanUpTitle(name);

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
