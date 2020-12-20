import { cleanUpString, cleanUpTitle } from "./cleanUpTitle";

const featuredOnlyFirstCap = [
  "Featuring",
  "Feat",
  "Ft",
  "Produced By:?",
  "Prod. By:?",
  "Special Guest:?",
  "Prod.",
  "w/",
  "X",
];
const featuredUppercase = featuredOnlyFirstCap.map((string) =>
  string.toUpperCase()
);
const featuredLowercase = featuredOnlyFirstCap.map((string) =>
  string.toLowerCase()
);
export const featuredAllCases = [
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
  "feat",
  "(?:P|p)roduced (?:B|b)y:?",
  "(?:P|p)rod. (?:B|b)y:?",
  "(?:S|s)pecial (?:G|g)uest:?",
  "(?:P|p)rod.",
  "w/",
  "X",
].join("|");
const featuredThatRequireDot = ["Feat", "ft"].join("|");
// const replaceRegEx = RegExp(
//   `^FEAT[^\\.]*.$|.*(?<=\\W|^)(?:${featuredThatDoNotRequireDot})(?:\\.|[^\\S\\r\\n])|.*(?:${featuredThatRequireDot})\\.|[\\](?:\\[)].*$|^.*`,
//   "g"
// );
const matchRegEx = RegExp(
  `^(?=FEAT[^.])|(?<=\\W|^)(?:${featuredThatDoNotRequireDot})(?:[^\\S\\r\\n]|\\.).*|(?<=\\W|^)(?:${featuredThatRequireDot})\\..*`,
  "g"
);
const matchAllEmojis =
  "(?:\\u00a9|\\u00ae|[\\u2000-\\u3300]|\\ud83c[\\ud000-\\udfff]|\\ud83d[\\ud000-\\udfff]|\\ud83e[\\ud000-\\udfff])";
const artistsSeparatorsOnlyFirstCap = [
  "&",
  " and ",
  ",",
  " x ",
  " e ",
  " si ",
  " Si ",
  " și ",
  " vs\\.? ",
  " with ",
  " Λ ",
  " y ",
];
const artistsSeparatorsLowerCase = artistsSeparatorsOnlyFirstCap.map((string) =>
  string.toLowerCase()
);
const artistsSeparatorsUppercase = artistsSeparatorsOnlyFirstCap.map((string) =>
  string.toUpperCase()
);
export const artistsSeparators = [
  ...artistsSeparatorsUppercase,
  ...artistsSeparatorsOnlyFirstCap,
  ...artistsSeparatorsLowerCase,
].join("|");
const splitRegEx = RegExp(
  `(?:${featuredThatDoNotRequireDot})(?:\\.|[^\\S\\r\\n])|(?:${featuredThatRequireDot})\\.|${matchAllEmojis}|${artistsSeparators}`,
  "g"
);
const replaceArtistsFromSongTitleRegEx = RegExp(
  `^(?=FEAT)|\\([^)]*\\)|\\[[^\\]]*\\]|(?:(?:${featuredThatRequireDot})\\.|(?<=\\W|^)(?:${featuredThatDoNotRequireDot})(?:[^\\S\\r\\n]|\\.)).*`,
  "g"
);
export const removeParensRegEx = RegExp(
  `\\((?=[^)]*(?:${featuredAllCases})(?:[^\\S\\r\\n]|\\.)[^)]*)|\\)|\\[(?=[^\\]]*(?:${featuredAllCases})(?:[^\\S\\r\\n]|\\.)[^\\]]*)|\\]|\\([^)]*\\)|\\[[^\\]]*\\]|\\*[^*]*\\*`,
  "g"
);
const splitters = [
  " - ",
  "–",
  ".:",
  "Performing",
  "performing",
  "PERFORMING",
  "Performed By",
].join("|");
export const getSongAndArtistsFromTitle = (title, channel = "") => {
  const cleanedChannel = cleanUpTitle(channel)
    .replace(/(?:Official|OFFICIAL|official|Oficial|OFICIAL|oficial)/g, "")
    .trim();
  const cleanedTitle = cleanUpString(title);
  const [artistName, name] = [
    cleanedChannel,
    ...cleanedTitle
      .split(RegExp(`(?:${splitters})(.*)`, "g"))
      .filter((string) => string !== "")
      .slice(0, 2),
  ].slice(-2);
  // if (title === "ADDA - Lupii (Nu plange, ADDA - 2016)") console.log(title);
  // console.log(removeParensRegEx);
  // const thingsThatFollowFeatured = name.replace(replaceRegEx, "");
  const thingsThatFollowFeatured = name
    ? name.match(matchRegEx)
      ? name.match(matchRegEx)[0].replace(removeParensRegEx, "").trim()
      : ""
    : "";
  const nameWithoutFeaturedArtistsAndParens = name
    ? name.replace(replaceArtistsFromSongTitleRegEx, "")
    : "";
  const cleanedName = cleanUpTitle(nameWithoutFeaturedArtistsAndParens);
  const featuredArtists = [
    ...new Set(
      [
        ...artistName.replace(removeParensRegEx, "").split(splitRegEx),
        ...thingsThatFollowFeatured.split(splitRegEx),
      ].map((artist) => (artist ? artist.trim() : artist))
    ),
  ].filter((artist) => artist);
  // console.log(cleanedTitle);
  // console.log(featuredArtists, cleanedName);
  return [
    featuredArtists,
    cleanedName.replace(/[()\\[\\]][^\\S\\r\\n]*?$/g, ""),
  ];
};
