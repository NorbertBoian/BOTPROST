import fetch from "node-fetch";
import { JSDOM } from "jsdom";
import { getSongURLandDuration } from "./getSongURLandDuration";
import knex from "knex";
import dotenv from "dotenv";
dotenv.config();
const db = knex({
  client: "pg",
  connection: process.env.PG_CONNECTION_EUROVISION,
});
export const fillDatabase = async (max = Infinity, min = 0) => {
  const yearsPageResponse = await fetch("https://eurovision.tv/events", {
    headers: {
      accept:
        "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9",
      "accept-language": "en-GB,en-US;q=0.9,en;q=0.8,ro;q=0.7",
      "cache-control": "max-age=0",
      "sec-fetch-dest": "document",
      "sec-fetch-mode": "navigate",
      "sec-fetch-site": "none",
      "sec-fetch-user": "?1",
      "upgrade-insecure-requests": "1",
    },
    referrerPolicy: "strict-origin-when-cross-origin",
    body: null,
    method: "GET",
    mode: "cors",
  });
  const yearsPageText = await yearsPageResponse.text();
  const yearsPagetHTML = new JSDOM(yearsPageText).window.document;
  const yearsListChildren = yearsPagetHTML.querySelector(
    "main > div > div.flex.flex-wrap"
  ).children;
  for (const yearListChild of yearsListChildren) {
    const yearPageURL = yearListChild.querySelector(":scope>div>a").href;
    const yearString = yearListChild
      .querySelector(":scope>div>div>div>h4")
      .textContent.replace(/\D/g, "");
    if (+yearString >= min && +yearString <= max) {
      let paths = ["/first-semi-final", "/second-semi-final", "/grand-final"];
      if (+yearString < 2004) paths = ["/final"];
      else if (+yearString < 2008) paths = ["/semi-final", "/grand-final"];
      for (const path of paths) {
        const pathResponse = await fetch(`${yearPageURL}${path}?sorting=rank`, {
          headers: {
            accept:
              "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9",
            "accept-language": "en-GB,en-US;q=0.9,en;q=0.8,ro;q=0.7",
            "cache-control": "max-age=0",
            "sec-fetch-dest": "document",
            "sec-fetch-mode": "navigate",
            "sec-fetch-site": "none",
            "sec-fetch-user": "?1",
            "upgrade-insecure-requests": "1",
          },
          referrer: yearPageURL,
          referrerPolicy: "strict-origin-when-cross-origin",
          body: null,
          method: "GET",
          mode: "cors",
        });
        const pathResponseText = await pathResponse.text();
        const pathResponseHTML = new JSDOM(pathResponseText).window.document;
        const countriesListChildren = Array.from(
          pathResponseHTML.querySelector("main>div>div>div>div.sort")
            .parentElement.children
        ).slice(1);
        for (const countryItem of countriesListChildren) {
          const countryName = countryItem
            .querySelector(":scope>div>a>span:nth-child(2)")
            .textContent.replace(/[\n\u008E]/g, "");
          const artistsNames = countryItem
            .querySelector(":scope>div>span.items-center")
            .previousElementSibling.querySelector(":scope>span")
            .textContent.replace(/[\n\u008E]/g, "");
          const songName = countryItem
            .querySelector(":scope>div>span.items-center")
            .textContent.replace(/[\n\u008E]/g, "");
          const { songURL, songDuration } = await getSongURLandDuration(
            artistsNames,
            songName
          );
          const imageTag = countryItem.querySelector(":scope>div>a>img");
          const image = imageTag
            ? imageTag.src.replace(/(?<=\/)[^/]*(?=\.\w{3,4}$)/g, "card")
            : undefined;
          const rankingSpan = countryItem.querySelector(
            ":scope>div>div>div>span.font-bold"
          );
          const ranking = rankingSpan
            ? rankingSpan.textContent.replace(/\D/g, "")
            : -1;
          console.log(+ranking, artistsNames, songName);
          const isWinner = +ranking === 1 ? true : false;
          if (path === "/grand-final") {
            const songObject = {
              country: countryName,
              year: +yearString,
              artists: artistsNames,
              song: songName,
              url: songURL,
              duration: songDuration,
              image,
              finalist: true,
              winner: isWinner,
            };
            await db("eurovision")
              .insert(songObject)
              .onConflict(["country", "year"])
              .merge();
          } else {
            const isFinalist = path === "/final" ? true : false;
            const songObject = {
              country: countryName,
              year: +yearString,
              artists: artistsNames,
              song: songName,
              url: songURL,
              duration: songDuration,
              image,
              finalist: isFinalist,
              winner: isFinalist ? isWinner : false,
            };
            await db("eurovision")
              .insert(songObject)
              .onConflict(["country", "year"])
              .merge();
          }
        }
        console.log(`${yearPageURL}${path} done.`);
      }
    }
  }
};

// fillDatabase(2009);
fillDatabase();
