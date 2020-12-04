const ytdl = require("discord-ytdl-core");
export const playSong = (
  url,
  connection,
  startInTheMiddle = false,
  duration = undefined
) => {
  let beginAtInMiliseconds = 0;
  if (startInTheMiddle && duration) {
    const [minutes, seconds] = duration.split(":");
    const timeInSeconds = +minutes * 60 + +seconds;
    const oneThirdOrThirtySeconds = Math.min(Math.floor(timeInSeconds / 3), 30);
    const max = timeInSeconds - oneThirdOrThirtySeconds;
    const min = oneThirdOrThirtySeconds;
    beginAtInMiliseconds =
      1000 * Math.floor(Math.random() * (max - min + 1)) + min;
    console.log(
      minutes,
      seconds,
      timeInSeconds,
      oneThirdOrThirtySeconds,
      max,
      min,
      beginAtInMiliseconds
    );
  }
  const dispatcher = connection.play(
    ytdl(url, {
      filter: "audioonly",
      opusEncoded: true,
      begin: duration,
    }),
    { type: "opus" }
  );
  return dispatcher;
};
