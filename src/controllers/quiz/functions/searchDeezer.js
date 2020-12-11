import stringSimilarity from "string-similarity";
import { getSongAndArtistsFromTitle } from "./getSongAndArtistsFromTitle";
import { deezerAPI as deezer } from "../functions/deezerAPI";
import { lastFmWithPromise } from "./lastFmWithPromise";
export const searchDeezer = (playListData) => {
  const deezerGetSongInfoFunctions = playListData.map(
    (songData) => async () => {
      try {
        const { songTitle, songChannel, songDuration, songURL } = songData;
        const [
          initialArtistsNames,
          initialSongName,
        ] = getSongAndArtistsFromTitle(songTitle, songChannel);
        const searchQuery = `${initialArtistsNames.join(
          " "
        )} ${initialSongName}`;
        // console.log(searchQuery);
        const deezerSearchResult = await deezer.search.track(
          searchQuery,
          "RANKING"
        );
        const deezerSearchResultData = deezerSearchResult.data;
        const deezerFoundArtistsNames = deezerSearchResultData.map(
          (foundSongData) => foundSongData.artist.name
        );
        const chooseResultFilter = (foundArtist) => {
          const artistSimilarEnoughFfilter = (artistName) =>
            stringSimilarity.compareTwoStrings(
              artistName.toLowerCase(),
              foundArtist.toLowerCase()
            ) > 0.8;
          return initialArtistsNames.some(artistSimilarEnoughFfilter);
        };
        const deezerChosenResultIndex = deezerFoundArtistsNames.findIndex(
          chooseResultFilter
        );
        if (deezerChosenResultIndex > -1) {
          const deezerArtistName =
            deezerSearchResultData[deezerChosenResultIndex].artist.name;
          const deezerSongName =
            deezerSearchResultData[deezerChosenResultIndex].title_short;
          const deezerAlbumArtwork =
            deezerSearchResultData[deezerChosenResultIndex].album.cover_medium;
          const deezerTrackId =
            deezerSearchResultData[deezerChosenResultIndex].id;
          const deezerTrackInfo = await deezer.track(deezerTrackId);
          const deezerTrackContributors = deezerTrackInfo.contributors;
          const isFeaturedArtist = (contributor) =>
            contributor.type === "artist" && contributor.role !== "Main";
          const deezerFeaturedArtistsData = deezerTrackContributors.filter(
            isFeaturedArtist
          );
          const deezerFeaturedArtistsNames = deezerFeaturedArtistsData.map(
            (featuredArtistData) => featuredArtistData.name
          );
          const deezerArtistNames = [
            deezerArtistName,
            ...deezerFeaturedArtistsNames,
          ];
          const [artistsNames, songName] = getSongAndArtistsFromTitle(
            `${deezerArtistNames} - ${deezerSongName}`
          );
          console.log(artistsNames.join(" "), songName);
          const songInfo = {
            songName: songName,
            artistsNames,
            url: songURL,
            thumbnail: deezerAlbumArtwork,
            duration: songDuration,
          };
          return songInfo;
        } else {
          const lastFmSearchResult = await lastFmWithPromise("trackSearch", {
            q: searchQuery,
            limit: 100,
          });
          const lastFmSearchResultData = lastFmSearchResult.result;
          const lastFmFoundArtistsNames = lastFmSearchResultData.map(
            (foundSongData) => foundSongData.artistName
          );
          const lastFmChosenResultIndex = lastFmFoundArtistsNames.findIndex(
            chooseResultFilter
          );
          if (lastFmChosenResultIndex > -1) {
            const lastFmArtistName =
              lastFmSearchResultData[lastFmChosenResultIndex].artistName;
            const lastFmSongName =
              lastFmSearchResultData[lastFmChosenResultIndex].name;
            const lastFmTrackInfo = await lastFmWithPromise("trackInfo", {
              name: lastFmSongName,
              artistName: lastFmArtistName,
            });
            const lastFmAlbumArtwork = lastFmTrackInfo.images
              ? lastFmTrackInfo.images[lastFmTrackInfo.images.length - 1]
              : undefined;
            const [artistsNames, songName] = getSongAndArtistsFromTitle(
              `${lastFmArtistName} - ${lastFmSongName}`
            );
            console.log(artistsNames.join(" "), songName);
            const songInfo = {
              songName: songName,
              artistsNames,
              url: songURL,
              thumbnail: lastFmAlbumArtwork,
              duration: songDuration,
            };
            return songInfo;
          } else return "No results.";
        }
      } catch (error) {
        console.log(error);
      }
    }
  );
  return deezerGetSongInfoFunctions;
};
