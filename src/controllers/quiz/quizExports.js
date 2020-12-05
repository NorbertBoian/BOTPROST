export const playlistURL =
  "https://www.youtube.com/playlist?list=PL15B1E77BB5708555";
export const defaultThumbnail =
  "https://millennialdiyer.com/wp1/wp-content/uploads/2018/11/Tips-Tricks-for-Assigning-Album-Cover-Art-to-your-Music-Library-Default-Image.jpg";

const eurovisionCountries = [
  "Albania",
  "Andorra",
  "Armenia",
  "Australia",
  "Austria",
  "Azerbaijan",
  "Belarus",
  "Belgium",
  "Bosnia and Herzegovina",
  "Bosnia",
  "Bulgaria",
  "Croatia",
  "Cyprus",
  "Czech Republic",
  "Denmark",
  "Estonia",
  "Finland",
  "France ",
  "Georgia",
  "Germany",
  "Greece",
  "Hungary",
  "Iceland",
  "Ireland",
  "Israel",
  "Italy",
  "Latvia",
  "Lithuania",
  "Luxembourg",
  "Malta",
  "Moldova",
  "Monaco",
  "Montenegro",
  "Morocco",
  "Netherlands",
  "North Macedonia",
  "F.Y.R Macedonia",
  "Macedonia",
  "F.Y.R",
  "FYR",
  "Norway",
  "Poland",
  "Portugal",
  "Romania",
  "Russia",
  "SanMarino",
  "Serbia and Montenegro",
  "Serbia",
  "Slovakia",
  "Slovenia",
  "Spain",
  "Sweden",
  "Switzerland",
  "Turkey",
  "Ukraine",
  "United Kingdom",
  "Yugoslavia",
];

const eurovisionCountriesAllCases = [
  ...eurovisionCountries,
  ...eurovisionCountries.map((country) => country.toLocaleLowerCase()),
  ...eurovisionCountries.map((country) => country.toLocaleUpperCase()),
];

export const prostii = [
  "MV",
  "M\\\\V",
  "HD",
  "HQ",
  "High Definition",
  "HIT",
  "\\+18",
  "MUSIC VIDEO",
  "OFFICIAL VIDEO",
  "Official Video",
  "Official",
  "720p",
  "1070p",
  "4K",
  "official",
  "video clip",
  "NEW",
  "LYRICS",
  "LYRIC",
  "VIDEO",
  "lyrics",
  "lyric",
  "video",
  "audio",
  "manele",
  "vechi",
  "de  dragoste",
  "- Hit",
  "k-play",
  "karaoke",
  "KARAOKE",
  "CBX",
  " oficial",
  "5K",
  "8K",
  "16K",
  "4:3",
  "5:4",
  "16:9",
  "21:9",
  "16:10",
  "HiT",
  " Oficial",
  "█▬█ █ ▀█▀",
  "STEREO",
  "at the Grand Final of the",
  "Eurovision Song Contest",
  "Eurovision",
  "EUROVISION",
  "WINNER",
  "LIVE at",
  "Live at",
  "LIVE",
  "Live -",
  "live -",
  "Grand Final",
  "First Semi-Final",
  "Second Semi-Final",
  "Semi-Final 1",
  "Semi Final 1",
  "Semi-Final 2",
  "Semi Final 2",
  "SF1",
  "SF 1",
  "SF2",
  "SF 2",
  "Semi-Final",
  "Semi Final",
  "semifinal",
  "1st",
  "2nd",
  "Interval Act at the",
  "Interval Act",
  "songs with live orchestra",
  "with orchestra",
  "Main Stage",
  "main stage",
  "at the",
  " Final",
  " Winner",
  " Live",
  ...eurovisionCountriesAllCases,
].join("|");

export const final = [
  "\\-  \\-",
  "the  of the",
  "the of the",
  "  of the",
  "   the",
  "\\| ",
].join("|");
