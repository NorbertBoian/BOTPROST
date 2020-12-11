import LastFM from "last-fm";
export const lastFmWithPromise = (method, paramsObject) =>
  new Promise((resolve, reject) => {
    const lastfm = new LastFM(process.env.LASTFM_API_KEY, {
      userAgent: "DiscordBot",
    });
    lastfm[method](paramsObject, (err, data) => {
      if (err) reject(err);
      else {
        resolve(data);
      }
    });
  });
