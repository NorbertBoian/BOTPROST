import getArtistTitle from "get-artist-title";
import { cleanUpTitle } from "./cleanUpTitle";

export const getBadTitle = (title, songChannel) => {
  const cleanedTitle = cleanUpTitle(title);
  const getArtistTitleResult = getArtistTitle(cleanedTitle);
  const badTitle = getArtistTitleResult
    ? getArtistTitleResult
    : [cleanUpTitle(songChannel), title];
  return badTitle;
};
