import LastFM from "last-fm";
const lastfm = new LastFM(process.env.LASTFM_API_KEY, {
  userAgent: "DiscordBot",
});
export const lastFmWithPromise = (method = "trackSearch", paramsObject) =>
  new Promise((resolve, reject) => {
    lastfm[method](paramsObject, (err, data) => {
      if (err) reject(err);
      else {
        resolve(data);
      }
    });
  });
