import stringSimilarity from "string-similarity";
export const checkUserResult = (answers, userAnswer) => {
  userAnswer = userAnswer.toLowerCase();
  const requiredCoeficient = 0.5;
  const songWasGuessed =
    stringSimilarity.compareTwoStrings(answers[0].toLowerCase(), userAnswer) >
    requiredCoeficient;
  const artistwasGuessed =
    stringSimilarity.compareTwoStrings(answers[1].toLowerCase(), userAnswer) >
    requiredCoeficient;
  const bothWereGuessed = answers
    .slice(-2)
    .some(
      (answer) =>
        stringSimilarity.compareTwoStrings(answer.toLowerCase(), userAnswer) >
        requiredCoeficient
    );
  if (songWasGuessed) return "song";
  if (artistwasGuessed) return "artist";
  if (bothWereGuessed) return "both";
};
