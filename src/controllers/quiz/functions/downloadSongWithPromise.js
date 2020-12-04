import ytdl from "ytdl-core";
export const downloadSongWithPromise = (url) =>
  new Promise((resolve, reject) => {
    const stream = ytdl(url, { filter: "audioonly" });
    console.log(stream.read());
    stream.on("readable", () => resolve(stream));
    stream.on("error", (error) => reject(error));
  });
