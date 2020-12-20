import stringSimilarity from "string-similarity";
import {
  getSongAndArtistsFromTitle,
  featuredAllCases,
  removeParensRegEx,
  artistsSeparators,
} from "./getSongAndArtistsFromTitle";
import { deezerAPI as deezer } from "../functions/deezerAPI";
import { lastFmWithPromise } from "./lastFmWithPromise";
import { unwantedChannels } from "../quizExports";
import { cleanUpString } from "./cleanUpTitle";
export const searchDeezer = (playListData) => {
  const deezerGetSongInfoFunctions = playListData.map(
    (songData) => async () => {
      try {
        //Search Spotify if not on Deezer
        //Check yt description
        //Remove between * *
        const { songTitle, songChannel, songDuration, songURL } = songData;
        // console.log(songTitle);
        const [
          initialArtistsNames,
          initialSongName,
        ] = getSongAndArtistsFromTitle(songTitle, songChannel);
        let searchQuery = "";
        const hasNoSeparator = !songTitle.includes(" - ");
        const unwantedChannelFilter = (unwantedChannel) =>
          unwantedChannel === songChannel;
        const isUwantedChannel = unwantedChannels.some(unwantedChannelFilter);
        if (hasNoSeparator && isUwantedChannel)
          searchQuery = cleanUpString(
            songTitle
              .replace(removeParensRegEx, "")
              .replace(
                RegExp(
                  `(?<=\\W)(?:${featuredAllCases})(?:\\.|[^\\S\\r\\n])`,
                  "g"
                ),
                ""
              )
              .replace(
                RegExp(
                  `[^\\S\\r\\n]?(?:${artistsSeparators})[^\\S\\r\\n]?`,
                  "g"
                ),
                " "
              )
          );
        else
          searchQuery = `${initialArtistsNames.join(
            " "
          )} ${initialSongName
            .replace(/(?:Hit|HIT|hit)(?:[^\S\r\n]|$)/g, "")
            .replace(/\s?-\s*$/g, "")}`.trim();
        // console.log(searchQuery);
        const deezerSearchResult = await deezer.search.track(
          searchQuery,
          "RANKING"
        );
        const deezerSearchResultData = deezerSearchResult.data
          ? deezerSearchResult.data
          : [];
        const deezerFoundArtistsAndSongs = deezerSearchResultData.map(
          (foundSongData) => [
            foundSongData.artist.name,
            foundSongData.title_short,
          ]
        );
        const chooseResultFilter = ([foundArtist, foundSong]) => {
          const artistSimilarEnoughFfilter = (artistName) => {
            if (
              stringSimilarity.compareTwoStrings(
                artistName.toLowerCase(),
                foundArtist.toLowerCase()
              ) > 0.8
            )
              return true;
            else
              return (
                stringSimilarity.compareTwoStrings(
                  artistName.toLowerCase(),
                  foundSong.toLowerCase()
                ) > 0.8
              );
          };
          if (hasNoSeparator && isUwantedChannel)
            return (
              stringSimilarity.compareTwoStrings(
                songTitle.toLowerCase(),
                `${foundSong} ${foundArtist}`.toLowerCase()
              ) > 0.5
            );
          else return initialArtistsNames.some(artistSimilarEnoughFfilter);
        };
        const deezerChosenResultIndex = deezerFoundArtistsAndSongs.findIndex(
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
          // console.log("DEEZER", artistsNames.join(" "), songName);
          // console.log(artistsNames.join(" &** "), songName);
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
            q: searchQuery ? searchQuery : " ",
            limit: 100,
          });
          const lastFmSearchResultData = lastFmSearchResult.result;
          const lastFmFoundArtistsAndSongs = lastFmSearchResultData.map(
            (foundSongData) => [foundSongData.artistName, foundSongData.name]
          );
          const lastFmChosenResultIndex = lastFmFoundArtistsAndSongs.findIndex(
            chooseResultFilter
          );
          console.log("LASTFM", searchQuery);
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
            // console.log(`${lastFmArtistName} - ${lastFmSongName}`);
            // console.log(artistsNames.join(" &** "), " 888 ", songName);
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
