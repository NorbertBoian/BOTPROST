import fetch from "node-fetch";
const headers = {
  "Content-Type": "	application/json",
};
export const deezerAPI = {
  search: {
    track: async (query, order = "RANKING") => {
      try {
        const encodedQuery = encodeURIComponent(query);
        const response = await fetch(
          `https://api.deezer.com/search/track?q=${encodedQuery}&order=${order}&limit=100`,
          headers
        );
        const JSONresponse = response.json();
        return JSONresponse;
      } catch (error) {
        console.log(error);
      }
    },
  },
  track: async (trackID) => {
    try {
      const response = await fetch(
        `https://api.deezer.com/track/${trackID}`,
        headers
      );
      const JSONresponse = response.json();
      return JSONresponse;
    } catch (error) {
      console.log(error);
    }
  },
};
