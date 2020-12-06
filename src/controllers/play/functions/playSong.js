import ytdl from "discord-ytdl-core";
export const playSong = (
  url,
  connection,
  startInTheMiddle = false,
  duration = undefined
) => {
  try {
    let beginAt = "none";
    if (startInTheMiddle && duration) {
      const [minutes, seconds] = duration.split(":");
      const timeInSeconds = +minutes * 60 + +seconds;
      const oneThirdOrThirtySeconds = Math.min(
        Math.floor(timeInSeconds / 3),
        30
      );
      const max = timeInSeconds - oneThirdOrThirtySeconds;
      const min = oneThirdOrThirtySeconds;
      beginAt = Math.floor(Math.random() * (max - min + 1)) + min;
    }
    const dispatcher = connection.play(
      ytdl(url, {
        filter: "audioonly",
        opusEncoded: true,
        seek: beginAt,
      }),
      { type: "opus" }
    );
    dispatcher.on("error", (error) => {
      console.log(error, url);
    });
    return dispatcher;
  } catch (error) {
    return error;
  }
};
