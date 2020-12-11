import stringSimilarity from "string-similarity";
const test = () => {
  const a = stringSimilarity.compareTwoStrings(
    "lean on",
    "major lazer lean on me"
  );
  console.log(a);
};
test();

// let correctAnswersInfo = correctAnswers
// if (isSimilarEnough) {
//   answersCombinations[indexOfMostSimilarAnswer].forEach(
//     (answerNameAndIndex) => {
//       if (!correctAnswersInfo[answerNameAndIndex.index].guessedBy) {
//         correctAnswersInfo[answerNameAndIndex.index] = {
//           ...correctAnswersInfo[answerNameAndIndex.index],
//           guessedBy: userAnswer.author.id,
//         };

//         console.log(correctAnswersInfo);
//       }
//     }
//   );
// }
