import { split } from "ffmpeg-static";
import { cleanUpTitle } from "./cleanUpTitle";

export const getSongAndArtistsFromTitle = (title, channel = "") => {
  const cleanedChannel = cleanUpTitle(channel);
  const [artistName, name] = [
    cleanedChannel,
    ...title.split(" - ").slice(0, 2),
  ].slice(-2);
  const featuredOnlyFirstCap = ["Featuring", "Feat", "Ft"];
  const featuredUppercase = featuredOnlyFirstCap.map((string) =>
    string.toUpperCase()
  );
  const featuredLowercase = featuredOnlyFirstCap.map((string) =>
    string.toLowerCase()
  );
  const featuredAllCases = [
    ...featuredUppercase,
    ...featuredOnlyFirstCap,
    ...featuredLowercase,
  ].join("|");
  const featuringAllCases = ["Featuring", "FEATURING", "featuring"];
  const featuredThatDoNotRequireDot = [
    ...featuringAllCases,
    "Ft",
    "FT",
    "FEAT",
  ].join("|");
  const featuredThatRequireDot = ["feat", "Feat", "ft"].join("|");
  const replaceRegEx = RegExp(
    `^FEAT[^\\.]*.$|.*(?:${featuredThatDoNotRequireDot})(?:\\.|[^\\S\\r\\n])|.*(?:${featuredThatRequireDot})\\.|[\\](?:\\[)].*$|^.*`,
    "g"
  );
  const matchAllEmojis =
    "(?:\\u00a9|\\u00ae|[\\u2000-\\u3300]|\\ud83c[\\ud000-\\udfff]|\\ud83d[\\ud000-\\udfff]|\\ud83e[\\ud000-\\udfff])";
  const artistsSeparatorsOnlyFirstCap = ["&", " and ", ",", " x ", " si "];
  const artistsSeparatorsLowerCase = artistsSeparatorsOnlyFirstCap.map(
    (string) => string.toLowerCase()
  );
  const artistsSeparatorsUppercase = artistsSeparatorsOnlyFirstCap.map(
    (string) => string.toUpperCase()
  );
  const artistsSeparators = [
    ...artistsSeparatorsUppercase,
    ...artistsSeparatorsOnlyFirstCap,
    ...artistsSeparatorsLowerCase,
  ].join("|");
  const splitRegEx = RegExp(
    `(?:${featuredThatDoNotRequireDot})(?:\\.|[^\\S\\r\\n])|(?:${featuredThatRequireDot})\\.|${matchAllEmojis}|${artistsSeparators}`,
    "g"
  );
  const replaceArtistsFromSongTitleRegEx = RegExp(
    `^(?=FEAT)|\\([^)]*\\)|\\[[^\\]]*\\]|(?:(?:${featuredThatRequireDot})\\.|(?:${featuredThatDoNotRequireDot})(?:[^\\S\\r\\n]|\\.)).*`,
    "g"
  );
  const removeParensRegEx = RegExp(
    `\\((?=(?:${featuredAllCases})(?:[^\\\\S\\\\r\\\\n]|\\.)[^)]*)|\\)|\\[(?=(?:${featuredAllCases})(?:[^\\\\S\\\\r\\\\n]|\\.)[^]]*)|\\]|\\([^)]*\\)|\\[[^\\]]*\\]`,
    "g"
  );
  // console.log(removeParensRegEx);
  const thingsThatFollowFeatured = name.replace(replaceRegEx, "");
  const nameWithoutFeaturedArtistsAndParens = name.replace(
    replaceArtistsFromSongTitleRegEx,
    ""
  );
  const cleanedName = cleanUpTitle(nameWithoutFeaturedArtistsAndParens);
  const featuredArtists = [
    ...new Set(
      [
        ...artistName.replace(removeParensRegEx, "").split(splitRegEx),
        ...thingsThatFollowFeatured.split(splitRegEx),
      ].map((artist) => (artist ? artist.trim() : artist))
    ),
  ].filter((artist) => artist);
  return [featuredArtists, cleanedName];
};
