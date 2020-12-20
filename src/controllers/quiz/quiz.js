import dotenv from "dotenv";
import { checkUserResult } from "./functions/checkUserResult";
import { updateUser } from "./functions/updateUser";
import { getRewardedUserIndex } from "./functions/getRewardedUserIndex";
import { shuffleArray } from "./functions/shuffleArray";
import { getRevealEmbedObject } from "./functions/getRevealEmbedObject";
import { getFinalRankingEmbedObject } from "./functions/getFinalRankingEmbedObject";
import { getSongsInfo } from "./functions/getSongsInfo";
import { playSong } from "../play/functions/playSong";
dotenv.config();
/// CHECK DISPATCHER ERROR HANDLING
/// CHECK NAME CLEANING
/// THINK IF SPLITING BY SPACE AND SORTING IS BETTER WHEN
/// ONLY GUESSING THE ARTIST AND SONG NAME IS WRONG
/// ALWAYS THE SAME SONGS SOMETHIGNS WRONG WITH SHUFFLEING
/// MAYBE JUST TOO FEW SONGS
/// TONIGHT AGAIN GUESSED BOTH BUT DIDNT RECEIVE BONUS AND
/// IT DIDNT STOP
/// ACTUALLY ALL SONGS DO THAT
/// WHEN CHECKING RESULTS CHECK HOW MANY SPACES IT SHOULD HAVE
/// AND TRY TO FIND ANSWERS INDIVIDUALLY SOMEHOW
/// INCLUDES MAY DO BUT DOES NOT CHECK FOR SIMILARITY
/// THINK OF SOMETHING
export const quiz = async (args, message, playlistURL, maxSongs, prefix) => {
  const getSongsInfoFunctions = await getSongsInfo(playlistURL, maxSongs);
  const shuffledGetSongsInfoFunctions = shuffleArray(getSongsInfoFunctions);
  const possibleMaxSongs = Math.min(
    maxSongs,
    shuffledGetSongsInfoFunctions.length
  );
  const songsInfo = [];
  let didGameEnd = false;
  const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
  let songInfoFunctionsIndex = -1;
  const getSongInfo = async (stopAfterFoundGivenNumberOfSongs = Infinity) => {
    songInfoFunctionsIndex++;
    if (songInfoFunctionsIndex < shuffledGetSongsInfoFunctions.length) {
      const stopAt = songsInfo.length + stopAfterFoundGivenNumberOfSongs;
      const songInfo = await shuffledGetSongsInfoFunctions[
        songInfoFunctionsIndex
      ]();
      if (typeof songInfo === "object" && !(songInfo instanceof Error))
        songsInfo.push(songInfo);
      if (
        songsInfo.length < possibleMaxSongs &&
        songsInfo.length < stopAt &&
        !didGameEnd
      ) {
        await wait(300);
        getSongInfo(stopAt);
      } else return "Found first song.";
    }
    return "No more songs to load.";
  };

  await getSongInfo(1);
  getSongInfo();
  // console.log(songsInfo);
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
      let dispatcher;
      const playSongInQuiz = async (song, voiceConnection) => {
        try {
          if (dispatcher && dispatcher.destroy) dispatcher.destroy();
          const songInfo = songsInfo[songIndex];
          let passed = 0;
          let extraPointWonBy = false;
          const correctAnswers = [...songInfo.artistsNames, songInfo.songName];
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
          let collector;
          // console.log(songsInfo);
          dispatcher = playSong(
            songInfo.url,
            voiceConnection,
            true,
            songInfo.duration
          );
          if (dispatcher instanceof Error) {
            console.log(
              `Error on ${songsInfo[songIndex].artistsNames.join(" ")} ${
                songsInfo[songIndex].songName
              } caused by :${dispatcher} \n ${songsInfo[songIndex].url}`
            );
            songsInfo.splice(songIndex, 1);
            await getSongInfo(1);
            //remove faulty song from songsinfo
            //add new one at random after current index in array
            if (songIndex <= songsInfo.length - 1) {
              playSongInQuiz(songsInfo[songIndex].url, connection);
            } else {
              didGameEnd = true;
              const finalRanking = getFinalRankingEmbedObject(competingUsers);
              await memberTextChannel.send({ embed: finalRanking });
            }
          } else {
            dispatcher.on("error", async () => {
              console.log(
                "ERROR HANDLING RN on error",
                songsInfo[songIndex],
                songIndex
              );
            });
            dispatcher.on("start", async () => {
              const filter = (messageToFilter) => !messageToFilter.author.bot;
              try {
                collector = memberTextChannel.createMessageCollector(filter, {
                  time: 30000,
                });
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
                      const [
                        wonPoints,
                        congratulationsMessage,
                        updatedExtraPointWonBy,
                        allAnswersWereGuessed,
                        updatedCorrectAnswersInfo,
                      ] = checkUserResult(
                        correctAnswersInfo,
                        userAnswer,
                        extraPointWonBy
                      );
                      extraPointWonBy = updatedExtraPointWonBy;
                      correctAnswersInfo = updatedCorrectAnswersInfo;
                      if (wonPoints) {
                        updateUser(
                          competingUsers,
                          rewardedUserIndex,
                          "score",
                          wonPoints
                        );
                        userAnswer.react("\u2705");
                        await memberTextChannel.send(congratulationsMessage);
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
                      competingUsers,
                      songsInfo.length
                    );
                    await memberTextChannel.send({ embed: reveal });
                    if (
                      songIndex < songsInfo.length - 1 &&
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
          }
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
