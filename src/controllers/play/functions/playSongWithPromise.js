import { playSong } from "./playSong";

export const playSongWithPromise = (
  url,
  connection,
  startInTheMiddle = false,
  duration = undefined
) =>
  new Promise((resolve, reject) => {
    const dispatcher = playSong(url, connection, startInTheMiddle, duration);
    dispatcher.on("start", resolve(dispatcher));
    dispatcher.on("error", reject("error"));
  });
