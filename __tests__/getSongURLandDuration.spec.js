import { getSongURLandDuration } from "../src/controllers/quiz/functions/getSongURLandDuration";

describe("getSongURLandDuration", () => {
  test("first,", async () => {
    const input = ["Alexander Rybak", "That's How You Write A Song"];
    const output = "https://www.youtube.com/watch?v=N17BdRwOvBA";
    const response = await getSongURLandDuration(...input);
    expect(response.songURL).toEqual(output);
  });
});
