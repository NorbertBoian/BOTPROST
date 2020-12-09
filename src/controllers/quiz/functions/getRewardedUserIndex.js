export const getRewardedUserIndex = (competingUsers, userAnswer) => {
  const userToBeRewarded = competingUsers.findIndex(
    (user) => user.id === userAnswer.author.id
  );
  return userToBeRewarded;
};
