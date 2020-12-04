export const getRewardedUserIndex = (competingUsers, userAnswer, reward) => {
  const userToBeRewarded = competingUsers.findIndex(
    (user) => user.id === userAnswer.author.id
  );
  return userToBeRewarded;
};
