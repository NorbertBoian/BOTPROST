import { getJoinedRankingStrings } from "./getJoinedRankingStrings";

export const getFinalRankingEmbedObject = (competingUsers) => {
  const joinedRankingStrings = getJoinedRankingStrings(competingUsers);
  const finalRanking = {
    color: 0x0099ff,
    title: "Music Quiz Ranking",

    description: `__**LEADERBOARD**__ \n\n ${joinedRankingStrings}`,
  };
  return finalRanking;
};
