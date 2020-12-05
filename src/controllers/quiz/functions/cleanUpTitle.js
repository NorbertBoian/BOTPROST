import { final, prostii } from "../quizExports";

export const cleanUpTitle = (title) => {
  const extensions = ["\\.flv", "\\.mp4", "\\.avi", "\\.mp3"].join("|");
  const titleWithoutParenthesis = title
    .replace(/\([^)]*\)|\[[^]*\]|\*[^*]*\*/g, "")
    .trim();
  const titleWithoutMizerii = titleWithoutParenthesis
    .replace(RegExp(`(${prostii})`, "g"), "")
    .trim();
  // console.log(RegExp(`(${prostii})`, "g"));
  const titleWithoutYear = titleWithoutMizerii.replace(
    /(?!1947)(19|20)[0-9][0-9]/g,
    ""
  );
  const titleWIthoutExtensions = titleWithoutYear
    .replace(RegExp(`(${extensions})`, "g"), "")
    .trim();
  //Asta e de pe stackoverflow=))
  const titleWithoutEmoji = titleWIthoutExtensions.replace(
    /([\u2700-\u27BF]|[\uE000-\uF8FF]|\uD83C[\uDC00-\uDFFF]|\uD83D[\uDC00-\uDFFF]|[\u2011-\u26FF]|\uD83E[\uDD10-\uDDFF])/g,
    ""
  );
  const cleanUpOnceMore = titleWithoutEmoji
    .replace(RegExp(`(${final})`, "g"), "")
    .trim();
  // console.log(RegExp(`(${final})`, "g"));
  return cleanUpOnceMore;
};
