import { final, prostii, prostiiFix } from "../quizExports";

const extensions = ["\\.flv", "\\.mp4", "\\.avi", "\\.mp3", "\\.wmv"].join("|");
export const cleanUpTitle = (title) => {
  // console.log(title);
  const titleWithoutParenthesis = title
    .replace(/\([^)]*\)|\[[^\]]*\]|\*[^*]*\*/g, "")
    .trim();
  const titleWithoutYear = titleWithoutParenthesis.replace(
    /(?!1944)(?:19|20)[0-9][0-9]:?/g,
    ""
  );
  const titleWithoutMizerii = titleWithoutYear
    .replace(RegExp(`(?:${prostii})`, "gi"), "")
    .replace(RegExp(`(?:${prostiiFix})`, "g"), "")
    .trim();
  // console.log(RegExp(`(${prostii})`, "g"));

  const titleWIthoutExtensions = titleWithoutMizerii
    .replace(RegExp(`(?:${extensions})`, "gi"), "")
    .trim();
  //Asta e de pe stackoverflow=))
  const titleWithoutEmoji = titleWIthoutExtensions.replace(
    /([\u2700-\u27BF]|[\uE000-\uF8FF]|\uD83C[\uDC00-\uDFFF]|\uD83D[\uDC00-\uDFFF]|[\u2011-\u26FF]|\uD83E[\uDD10-\uDDFF])/g,
    ""
  );
  // const cleanUpOnceMore = titleWithoutEmoji
  //   .replace(RegExp(`(?:${final})`, "gi"), "")
  //   .trim();
  const cleanUpOnceMore = final(titleWithoutEmoji).trim();
  // if (cleanUpOnceMore.includes("LIVE"))
  // console.log("TITLE", titleWithoutYear, "\n", titleWithoutMizerii);
  // console.log(RegExp(`(${final})`, "g"));
  return cleanUpOnceMore;
};

export const cleanUpString = (title) => {
  const titleWithoutYear = title.replace(/(?!1944)(19|20)[0-9][0-9]:?/g, "");
  const titleWithoutMizerii = titleWithoutYear
    .replace(RegExp(`(?:${prostii})`, "gi"), "")
    .replace(RegExp(`(?:${prostiiFix})`, "g"), "")
    .trim();

  //Asta e de pe stackoverflow=))
  const titleWithoutExtensions = titleWithoutMizerii
    .replace(RegExp(`(?:${extensions})`, "gi"), "")
    .trim();
  // const cleanUpOnceMore = titleWithoutExtensions
  //   .replace(RegExp(`(?:${final})`, "gi"), "")
  //   .trim();
  const cleanUpOnceMore = final(titleWithoutExtensions).trim();
  // if (cleanUpOnceMore.includes("LIVE"))
  // console.log("STRING", titleWithoutYear, "\n", titleWithoutMizerii);
  // console.log(RegExp(`(?:${prostii})`, "g"));
  // console.log(RegExp(`(${final})`, "g"));
  return cleanUpOnceMore;
};
