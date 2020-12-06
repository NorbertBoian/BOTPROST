import dotenv from "dotenv";
import { checkUserResult } from "./functions/checkUserResult";
import { updateUser } from "./functions/updateUser";
import { getRewardedUserIndex } from "./functions/getRewardedUserIndex";
import { playSongWithPromise } from "../play/functions/playSongWithPromise";
import { shuffleArray } from "./functions/shuffleArray";
import { getRevealEmbedObject } from "./functions/getRevealEmbedObject";
import { getFinalRankingEmbedObject } from "./functions/getFinalRankingEmbedObject";
dotenv.config();

export const quiz = async (args, message, songsInfo, prefix) => {
  const filteredSongsInfo = [...songsInfo].filter((info) => info && info.url);
  const shuffledSongsInfo = shuffleArray(filteredSongsInfo);
  console.log(songsInfo.length, filteredSongsInfo.length);
  if (filteredSongsInfo.length === 0) console.log(songsInfo.splice(0, 12));
  //console.log(shuffledSongsInfo, songsInfo);
  const memberTextChannel = message.channel;
  const memberVoiceChannel = message.member.voice.channel;
  const connection = await memberVoiceChannel.join();
  try {
    if (shuffledSongsInfo.length) {
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
          let passed = 0;
          let artistBeenGuessed = false;
          let songBeenGuessed = false;
          const dispatcher = await playSongWithPromise(
            shuffledSongsInfo[songIndex].url,
            voiceConnection,
            true,
            shuffledSongsInfo[songIndex].duration
          );
          dispatcher.on("error", async () => {
            const reveal = getRevealEmbedObject(
              shuffledSongsInfo,
              songIndex,
              competingUsers
            );
            await memberTextChannel.send({ embed: reveal });
            if (songIndex !== shuffledSongsInfo.length - 1) {
              songIndex++;
              playSongInQuiz(shuffledSongsInfo[songIndex].url, connection);
            } else {
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
                  const rewardedUserID = competingUsers[rewardedUserIndex].id;
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
                    const whatWasGuessed = checkUserResult(
                      shuffledSongsInfo[songIndex].answers,
                      userAnswer.content
                    );
                    // console.log(whatWasGuessed);
                    switch (whatWasGuessed) {
                      case "both":
                        {
                          if (!artistBeenGuessed && !songBeenGuessed) {
                            artistBeenGuessed = rewardedUserID;
                            songBeenGuessed = rewardedUserID;
                            competingUsers = updateUser(
                              competingUsers,
                              rewardedUserIndex,
                              "score",
                              3
                            );
                            await memberTextChannel.send(
                              `<@${rewardedUserID}> guessed both the song and the artist and therefore gets 3 points`
                            );
                            collector.stop("guessed");
                            userAnswer.react("\u2705");
                          } else if (!artistBeenGuessed) {
                            artistBeenGuessed = rewardedUserID;
                            if (artistBeenGuessed === songBeenGuessed) {
                              competingUsers = updateUser(
                                competingUsers,
                                rewardedUserIndex,
                                "score",
                                2
                              );
                              await memberTextChannel.send(
                                `<@${rewardedUserID}> guessed both the song and the artist and therefore gets 2 more points`
                              );
                              collector.stop("guessed");
                              userAnswer.react("\u2705");
                            } else {
                              competingUsers = updateUser(
                                competingUsers,
                                rewardedUserIndex,
                                "score",
                                1
                              );

                              await memberTextChannel.send(
                                `<@${rewardedUserID}> guessed the artist and gets 1 point`
                              );
                              collector.stop("guessed");
                            }
                          } else {
                            songBeenGuessed = rewardedUserID;
                            if (songBeenGuessed === artistBeenGuessed) {
                              competingUsers = updateUser(
                                competingUsers,
                                rewardedUserIndex,
                                "score",
                                2
                              );
                              await memberTextChannel.send(
                                `<@${rewardedUserID}> guessed both the song and the artist and therefore gets 2 more points`
                              );
                              collector.stop("guessed");
                              userAnswer.react("\u2705");
                            } else {
                              competingUsers = updateUser(
                                competingUsers,
                                rewardedUserIndex,
                                "score",
                                1
                              );
                              await memberTextChannel.send(
                                `<@${rewardedUserID}> guessed the song and gets 1 point`
                              );
                              collector.stop("guessed");
                            }
                          }
                        }
                        break;
                      case "song":
                        {
                          if (!songBeenGuessed) {
                            songBeenGuessed = rewardedUserID;
                            if (songBeenGuessed === artistBeenGuessed) {
                              competingUsers = updateUser(
                                competingUsers,
                                rewardedUserIndex,
                                "score",
                                2
                              );
                              await memberTextChannel.send(
                                `<@${rewardedUserID}> guessed both the song and the artist and therefore gets 2 more points`
                              );
                              collector.stop("guessed");
                              userAnswer.react("\u2705");
                            } else {
                              competingUsers = updateUser(
                                competingUsers,
                                rewardedUserIndex,
                                "score",
                                1
                              );
                              await memberTextChannel.send(
                                `<@${rewardedUserID}> guessed the song and gets 1 point`
                              );
                              if (artistBeenGuessed) collector.stop("guessed");
                              userAnswer.react("\u2705");
                            }
                          }
                        }
                        break;
                      case "artist":
                        {
                          if (!artistBeenGuessed) {
                            artistBeenGuessed = rewardedUserID;
                            if (artistBeenGuessed === songBeenGuessed) {
                              competingUsers = updateUser(
                                competingUsers,
                                rewardedUserIndex,
                                "score",
                                2
                              );
                              await memberTextChannel.send(
                                `<@${rewardedUserID}> guessed both the song and the artist and therefore gets 2 more points`
                              );
                              collector.stop("guessed");
                              userAnswer.react("\u2705");
                            } else {
                              competingUsers = updateUser(
                                competingUsers,
                                rewardedUserIndex,
                                "score",
                                1
                              );
                              await memberTextChannel.send(
                                `<@${rewardedUserID}> guessed the artist and gets 1 point`
                              );
                            }
                            if (songBeenGuessed) collector.stop("guessed");
                            userAnswer.react("\u2705");
                          }
                        }
                        break;
                      default:
                        userAnswer.react("\u274C");
                        break;
                    }
                  }
                } catch (error) {
                  console.log(error);
                }
              });
              collector.on("end", async (collected, reason) => {
                try {
                  const reveal = getRevealEmbedObject(
                    shuffledSongsInfo,
                    songIndex,
                    competingUsers
                  );
                  await memberTextChannel.send({ embed: reveal });
                  if (
                    songIndex < shuffledSongsInfo.length - 1 &&
                    reason !== "stopped"
                  ) {
                    songIndex++;
                    playSongInQuiz(
                      shuffledSongsInfo[songIndex].url,
                      connection
                    );
                  } else {
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
      playSongInQuiz(shuffledSongsInfo[0].url, connection);
    }
  } catch (error) {
    console.log(error);
  }
};
