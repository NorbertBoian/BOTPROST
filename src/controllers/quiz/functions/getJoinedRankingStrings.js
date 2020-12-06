export const getJoinedRankingStrings = (competingUsers) => {
  const compareFunction = (a, b) => b.score - a.score;
  const usersOrderedByScore = competingUsers.sort(compareFunction);
  const medals = ["\uD83E\uDD47", "\uD83E\uDD48", "\uD83E\uDD49"];
  const rankingStrings = usersOrderedByScore.map(
    (user, index) =>
      `${index < 3 ? medals[index] : `${index + 1}.`} <@${user.id}> - ${
        user.score
      } ${user.score === 1 ? "pt" : "pts"}`
  );
  const joinedRankingStrings = rankingStrings.join("\n\n");
  return joinedRankingStrings;
};
