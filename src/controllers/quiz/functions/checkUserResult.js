export const checkUserResult = (answers, userAnswer) => {
  userAnswer = userAnswer.toLowerCase();
  if (answers[0].toLowerCase() === userAnswer) return "song";
  if (answers[1].toLowerCase() === userAnswer) return "artist";
  if (answers.slice(-2).some((answer) => answer.toLowerCase() === userAnswer))
    return "both";
};
