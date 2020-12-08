import { slice } from "ffmpeg-static";
import { cleanUpTitle } from "./cleanUpTitle";

export const getFeaturedArtistsFromTitle = (title, channel = "") => {
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
  const replaceRegEx = `^FEAT[^\\.]*.$|.*(?:${featuredThatDoNotRequireDot})(?:\\.|[^\\S\\r\\n])|.*(?:${featuredThatRequireDot})\\.|[\\](?:\\[)].*$|^.*`;
  const thingsThatFollowFeatured = name.replace(RegExp(replaceRegEx, "g"), "");
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
    `[^(?:[\\n](?:${featuredThatDoNotRequireDot})(?:\\.|[^\\S\\r\\n])|(?:${featuredThatRequireDot})\\.|${matchAllEmojis}|${artistsSeparators}`,
    "g"
  );
  const replaceArtistsFromSongTitleRegEx = `\\((?:${featuredAllCases})([^\\S\\r\\n]|\\.)[^)]*\\)|\\[(?:${featuredAllCases})([^\\S\\r\\n]|\\.)[^\\]]*\\]|(?:${featuredAllCases})([^\\S\\r\\n]|\\.).*|\\([^)]*\\)|\\[[^\\]]*\\]`;
  const nameWithoutFeaturedArtistsAndParens = name.replace(
    RegExp(replaceArtistsFromSongTitleRegEx, "g"),
    ""
  );
  const cleanedName = cleanUpTitle(nameWithoutFeaturedArtistsAndParens);
  const featuredArtists = [
    artistName,
    ...thingsThatFollowFeatured.split(splitRegEx),
  ].map((artist) => (artist ? artist.trim() : ""));
  if (!thingsThatFollowFeatured.length) {
    const removeParensRegEx = RegExp(
      `\\[[^\\]]*(?:${featuredAllCases})(?:[^\\S\\r\\n]|\\.)|(?<=(?:${featuredAllCases})(?:[^\\S\\r\\n]|\\.)[^\\]]*)\\]|\\([^)]*(?:${featuredAllCases})(?:[^\\S\\r\\n]|\\.)|(?<=(?:${featuredAllCases})(?:[^\\S\\r\\n]|\\.)[^)]*)\\)|\\([^\\)]*\\)|\\[[^[]*\\]`,
      "g"
    );
    const allArtists = artistName
      .replace(removeParensRegEx, "")
      .split(splitRegEx)
      .map((artist) => (artist ? artist.trim() : ""));
    return allArtists.length < 2
      ? [[artistName], cleanedName]
      : [allArtists, cleanedName];
  }
  return [featuredArtists, cleanedName];
};
