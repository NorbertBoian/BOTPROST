import dotenv from "dotenv";
import stringSimilarity from "string-similarity";
import { checkUserResult } from "./functions/checkUserResult";
import { updateUser } from "./functions/updateUser";
import { getRewardedUserIndex } from "./functions/getRewardedUserIndex";
import { playSongWithPromise } from "../play/functions/playSongWithPromise";
import { shuffleArray } from "./functions/shuffleArray";
import { getRevealEmbedObject } from "./functions/getRevealEmbedObject";
import { getFinalRankingEmbedObject } from "./functions/getFinalRankingEmbedObject";
import { getSongsInfo } from "./functions/getSongsInfo";
import { getCombinations } from "./functions/getCombinations";
dotenv.config();

export const quiz = async (args, message, playlistURL, maxSongs, prefix) => {
  const getSongsInfoFunctions = getSongsInfo(playlistURL, maxSongs);
  const shuffledGetSongsInfoFunctions = shuffleArray(
    getSongsInfoFunctions
  ).slice(0, maxSongs);
  const songsInfo = [];
  let didGameEnd = false;
  const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
  const getSongInfo = async () => {
    const index = songsInfo.length;
    const songInfo = await shuffledGetSongsInfoFunctions[index]();
    songsInfo.push(songInfo);
    if (index - 1 < shuffledGetSongsInfoFunctions.length && !didGameEnd) {
      await wait(300);
      getSongInfo();
    }
  };
  getSongInfo();
  const memberTextChannel = message.channel;
  const memberVoiceChannel = message.member.voice.channel;
  const connection = await memberVoiceChannel.join();
  try {
    if (songsInfo.length) {
      await memberTextChannel.send("Game starts soon!");
      let competingUsers = memberVoiceChannel.members
        .filter((memberToFilter) => !memberToFilter.user.bot)
        .map((filteredMember) => ({
          id: filteredMember.user.id,
          username: filteredMember.user.username,
          score: 0,
          passed: false,
        }));
      const requiredPasses = Math.max(
        1,
        Math.floor(competingUsers.length / 2) + 1
      );
      let songIndex = 0;
      const playSongInQuiz = async (song, voiceConnection) => {
        try {
          const songInfo = songsInfo[songIndex];
          let passed = 0;
          let extraPointWonBy = false;
          const dispatcher = await playSongWithPromise(
            songInfo.url,
            voiceConnection,
            true,
            songInfo.duration
          );
          dispatcher.on("error", async () => {
            const reveal = getRevealEmbedObject(
              songsInfo,
              songIndex,
              competingUsers
            );
            await memberTextChannel.send({ embed: reveal });
            if (songIndex !== shuffledGetSongsInfoFunctions.length - 1) {
              songIndex++;
              playSongInQuiz(songsInfo[songIndex].url, connection);
            } else {
              didGameEnd = true;
              dispatcher.destroy();
              const finalRanking = getFinalRankingEmbedObject(competingUsers);
              await memberTextChannel.send({ embed: finalRanking });
            }
          });
          dispatcher.on("start", async () => {
            const filter = (messageToFilter) => !messageToFilter.author.bot;
            try {
              const collector = memberTextChannel.createMessageCollector(
                filter,
                {
                  time: 30000,
                }
              );
              collector.on("collect", async (userAnswer) => {
                try {
                  const rewardedUserIndex = getRewardedUserIndex(
                    competingUsers,
                    userAnswer
                  );
                  // const rewardedUserID = competingUsers[rewardedUserIndex].id;
                  const hasPassedAlready =
                    competingUsers[rewardedUserIndex.passed];
                  if (
                    userAnswer.content === `${prefix}pass` &&
                    !hasPassedAlready
                  ) {
                    competingUsers = updateUser(
                      competingUsers,
                      rewardedUserIndex,
                      "passed",
                      true
                    );
                    passed++;
                    if (passed >= requiredPasses) collector.stop("passed");
                    else {
                      await memberTextChannel.send(
                        `\u23ED\uFE0F ${passed}/${requiredPasses} votes to pass the song.`
                      );
                    }
                  } else if (userAnswer.content === `${prefix}quizstop`) {
                    collector.stop("stopped");
                  } else {
                    const correctAnswers = [
                      ...songInfo.artistsNames,
                      songInfo.songName,
                    ];
                    let correctAnswersInfo = correctAnswers.map((name, i) => ({
                      name,
                      guessedBy: false,
                      type:
                        i === 0
                          ? "main"
                          : i === correctAnswers.length - 1
                          ? "song"
                          : "featured",
                    }));
                    const correctAnswersNameAndIndex = correctAnswers.map(
                      (name, index) => ({ name, index })
                    );
                    //Daca e prea incet cu combinatii se poate despartii la spatiu si sorta
                    const answersCombinations = getCombinations(
                      correctAnswersNameAndIndex
                    );
                    const answersCombinationsJoined = answersCombinations.map(
                      (nameAndIndexObjects) =>
                        nameAndIndexObjects
                          .map((nameAndIndexObject) => nameAndIndexObject.name)
                          .join(" ")
                    );
                    const getUpdatedCorrectAnswersInfo = (
                      correctAnswerIndex,
                      key,
                      value
                    ) => {
                      return {
                        ...correctAnswersInfo[correctAnswerIndex],
                        [key]: value,
                      };
                    };
                    const answersSimilarity = answersCombinationsJoined.map(
                      (answer) => {
                        stringSimilarity(
                          answer.toLowerCase(),
                          userAnswer.content.toLowerCase()
                        );
                      }
                    );
                    //Daca e prea incet pot inlocui cu o functie sa nu compare de 2 ori csf
                    const mostSimilarAnswer = Math.max(...answersSimilarity);
                    const indexOfMostSimilarAnswer = answersSimilarity.indexOf(
                      mostSimilarAnswer
                    );
                    const isSimilarEnough = mostSimilarAnswer > 0.7;
                    let wonPoints = 0;
                    let wasMainArtistGuessed = false;
                    let numberOfFeaturedArtistsGuessed = 0;
                    let wasSongNameGuessed = false;
                    if (isSimilarEnough) {
                      correctAnswersNameAndIndex[
                        indexOfMostSimilarAnswer
                      ].forEach((answerNameAndInfo) => {
                        if (
                          !correctAnswersInfo[answerNameAndInfo.index].guessedBy
                        ) {
                          correctAnswersInfo = getUpdatedCorrectAnswersInfo(
                            answerNameAndInfo.index,
                            "guessedBy",
                            userAnswer.author.id
                          );
                          wonPoints++;
                          switch (
                            correctAnswersInfo[answerNameAndInfo.index].type
                          ) {
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
                      });
                    }

                    const songNameMessage = wasSongNameGuessed
                      ? ` ${
                          numberOfFeaturedArtistsGuessed || wasMainArtistGuessed
                            ? "and "
                            : ""
                        }the song's name`
                      : "";
                    const mainArtistMessage = wasMainArtistGuessed
                      ? " the main artist"
                      : "";
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
                    const userGuessedTheSong =
                      guessedByArray[guessedByArray.length - 1] ===
                      userAnswer.author.id;
                    const didUserGuessAnyArtist = (user) =>
                      user === userAnswer.author.id;
                    const artistsGuessedByArray = guessedByArray.slice(0, -1);
                    const isWorthyOfExtraPoint =
                      artistsGuessedByArray.some(didUserGuessAnyArtist) &&
                      userGuessedTheSong;

                    if (!extraPointWonBy && isWorthyOfExtraPoint) {
                      extraPointWonBy = userAnswer.author.id;
                      wonPoints++;
                    }
                    const congratulationsMessage = `<@${
                      userAnswer.author.id
                    } guessed${mainArtistMessage}${featuredArtistMessage}${songNameMessage} correctly and therefore gets ${wonPoints} point${
                      wonPoints !== 1 ? "s" : ""
                    }.`;
                    if (wonPoints) {
                      userAnswer.react("\u2705");
                      await memberTextChannel.send(congratulationsMessage);
                      const wasNotGuessed = (whoGuessed) =>
                        whoGuessed === false;
                      const allAnswersWereGuessed = !guessedByArray.some(
                        wasNotGuessed
                      );
                      if (allAnswersWereGuessed) {
                        collector.stop();
                      }
                    } else {
                      userAnswer.react("\u274C");
                    }
                  }
                } catch (error) {
                  console.log(error);
                }
              });
              collector.on("end", async (collected, reason) => {
                try {
                  const reveal = getRevealEmbedObject(
                    songsInfo,
                    songIndex,
                    competingUsers
                  );
                  await memberTextChannel.send({ embed: reveal });
                  if (
                    songIndex < shuffledGetSongsInfoFunctions.length - 1 &&
                    reason !== "stopped"
                  ) {
                    songIndex++;
                    playSongInQuiz(songsInfo[songIndex].url, connection);
                  } else {
                    didGameEnd = true;
                    dispatcher.destroy();
                    const finalRanking = getFinalRankingEmbedObject(
                      competingUsers
                    );
                    await memberTextChannel.send({ embed: finalRanking });
                  }
                } catch (error) {
                  console.log(error);
                }
              });
            } catch (error) {
              console.log(error);
            }
          });
        } catch (error) {
          console.log(error);
        }
      };
      // console.log(shuffledSongsInfo);
      playSongInQuiz(songsInfo[0].url, connection);
    }
  } catch (error) {
    console.log(error);
  }
};
