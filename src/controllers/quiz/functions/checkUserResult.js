import stringSimilarity from "string-similarity";
import { getCombinations } from "./getCombinations";
import { remove as removeDiacritics } from "diacritics";
export const checkUserResult = (
  correctAnswersInfo,
  userAnswer,
  extraPointWonBy
) => {
  const correctAnswersNameAndIndex = correctAnswersInfo.map(
    (correctAnswerInfo, index) => ({
      name: correctAnswerInfo.name,
      index,
    })
  );
  //Daca e prea incet cu combinatii se poate despartii la spatiu si sorta
  const answersCombinations = getCombinations(correctAnswersNameAndIndex);
  const answersCombinationsJoined = answersCombinations.map(
    (nameAndIndexObjects) =>
      nameAndIndexObjects
        .map((nameAndIndexObject) => nameAndIndexObject.name)
        .join(" ")
  );
  // console.log(answersCombinationsJoined);
  const getUpdatedCorrectAnswerInfo = (
    currentCorrectAnswerInfo,
    key,
    value
  ) => {
    const updatedCorrectAnswerInfo = {
      ...currentCorrectAnswerInfo,
      [key]: value,
    };
    return updatedCorrectAnswerInfo;
  };
  // console.log(answersCombinationsJoined);
  // console.log(userAnswer.content, correctAnswersInfo);
  const answersSimilarity = answersCombinationsJoined.map((answer) =>
    stringSimilarity.compareTwoStrings(
      removeDiacritics(answer).toLowerCase(),
      removeDiacritics(userAnswer.content).toLowerCase()
    )
  );
  //Daca e prea incet pot inlocui cu o functie sa nu compare de 2 ori csf
  const mostSimilarAnswer = Math.max(...answersSimilarity);
  const indexOfMostSimilarAnswer = answersSimilarity.indexOf(mostSimilarAnswer);
  // console.log(answersCombinations[indexOfMostSimilarAnswer]);
  // console.log(correctAnswersInfo);
  const isSimilarEnough = mostSimilarAnswer > 0.45;
  let wonPoints = 0;
  let wasMainArtistGuessed = false;
  let numberOfFeaturedArtistsGuessed = 0;
  let wasSongNameGuessed = false;
  // console.log(isSimilarEnough, answersSimilarity);
  if (isSimilarEnough) {
    answersCombinations[indexOfMostSimilarAnswer].forEach(
      (answerNameAndIndex) => {
        if (!correctAnswersInfo[answerNameAndIndex.index].guessedBy) {
          correctAnswersInfo[answerNameAndIndex.index] = {
            ...correctAnswersInfo[answerNameAndIndex.index],
            guessedBy: userAnswer.author.id,
          };
          // getUpdatedCorrectAnswerInfo(
          //   correctAnswersInfo[answerNameAndIndex.index],
          //   "guessedBy",
          //   userAnswer.author.id
          // );
          // console.log(correctAnswersInfo);
          wonPoints++;
          switch (correctAnswersInfo[answerNameAndIndex.index].type) {
            case "main":
              wasMainArtistGuessed = true;
              break;
            case "featured":
              numberOfFeaturedArtistsGuessed++;
              break;
            case "song":
              wasSongNameGuessed = true;
              break;
          }
        }
      }
    );
  }

  const songNameMessage = wasSongNameGuessed
    ? ` ${
        numberOfFeaturedArtistsGuessed || wasMainArtistGuessed ? "and " : ""
      }the song's name`
    : "";
  const mainArtistMessage = wasMainArtistGuessed ? " the main artist" : "";
  const featuredArtistMessage = numberOfFeaturedArtistsGuessed
    ? ` ${
        wasMainArtistGuessed ? "and " : ""
      }${numberOfFeaturedArtistsGuessed} featured artist${
        numberOfFeaturedArtistsGuessed > 1 ? "s" : ""
      }`
    : "";
  const guessedByArray = correctAnswersInfo.map(
    (correctAnswerInfo) => correctAnswerInfo.guessedBy
  );
  // console.log(guessedByArray);
  const userGuessedTheSong =
    guessedByArray[guessedByArray.length - 1] === userAnswer.author.id;
  const didUserGuessAnyArtist = (user) => user === userAnswer.author.id;
  const artistsGuessedByArray = guessedByArray.slice(0, -1);
  const isWorthyOfExtraPoint =
    artistsGuessedByArray.some(didUserGuessAnyArtist) && userGuessedTheSong;
  // console.log(
  //   !extraPointWonBy,
  //   isWorthyOfExtraPoint,
  //   artistsGuessedByArray.some(didUserGuessAnyArtist),
  //   userGuessedTheSong
  // );
  if (!extraPointWonBy && isWorthyOfExtraPoint) {
    extraPointWonBy = userAnswer.author.id;
    wonPoints++;
  }
  const congratulationsMessage = `<@${
    userAnswer.author.id
  }> guessed${mainArtistMessage}${featuredArtistMessage}${songNameMessage} correctly and therefore gets ${wonPoints} point${
    wonPoints !== 1 ? "s" : ""
  }.`;
  const wasNotGuessed = (whoGuessed) => whoGuessed === false;
  const allAnswersWereGuessed = !guessedByArray.some(wasNotGuessed);
  return [
    wonPoints,
    congratulationsMessage,
    extraPointWonBy,
    allAnswersWereGuessed,
    correctAnswersInfo,
  ];
};
