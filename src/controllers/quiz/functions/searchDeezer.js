import stringSimilarity from "string-similarity";
import DeezerPublicApi from "deezer-public-api";
import { getSongAndArtistsFromTitle } from "./getSongAndArtistsFromTitle";
const deezer = new DeezerPublicApi();

export const searchDeezer = ({
  songsDuration,
  songURLs,
  songTitles,
  songChannels,
}) => {
  const deezerGetSongInfoFunctions = songTitles.map((title, i) => async () => {
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
        (featuredArtistData) => featuredArtistData.name
      );
      const deezerArtistNames = [deezerArtistName, ...featuredArtistsNames];
      const [artistsNames, songName] = getSongAndArtistsFromTitle(
        `${deezerArtistNames} - ${deezerSongName}`
      );
      const songInfo = {
        songName,
        artistsNames,
        url: songURLs[i],
        thumbnail: albumArtwork,
        duration: songsDuration[i],
      };
      return songInfo;
    }
  });
  return deezerGetSongInfoFunctions;
};
