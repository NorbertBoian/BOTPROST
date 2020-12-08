const {
  getFeaturedArtistsFromTitle,
} = require("../src/controllers/quiz/functions/getFeaturedArtistsFromTitle");

describe("getFeaturedArtist", () => {
  test("ft. and ,", () => {
    const input = ["David - Play ft. Ne-Yo, Akon"];
    const output = [["David", "Ne-Yo", "Akon"], "Play"];
    expect(getFeaturedArtistsFromTitle(...input)).toEqual(output);
  });
  test("feat. in () and &", () => {
    const input = ["David - Play (feat. Ne-Yo & Akon)"];
    const output = [["David", "Ne-Yo", "Akon"], "Play"];
    expect(getFeaturedArtistsFromTitle(...input)).toEqual(output);
  });
  test("Feat. in [] and and", () => {
    const input = ["David - Play [Feat.Ne-Yo and Akon]"];
    const output = [["David", "Ne-Yo", "Akon"], "Play"];
    expect(getFeaturedArtistsFromTitle(...input)).toEqual(output);
  });
  test("Ft. and x", () => {
    const input = ["David - Play Ft. Ne-Yo x Akon"];
    const output = [["David", "Ne-Yo", "Akon"], "Play"];
    expect(getFeaturedArtistsFromTitle(...input)).toEqual(output);
  });
  test("FT. and AND and hyphen in name", () => {
    const input = ["David - Play FT. Ne-Yo AND Akon"];
    const output = [["David", "Ne-Yo", "Akon"], "Play"];
    expect(getFeaturedArtistsFromTitle(...input)).toEqual(output);
  });
  test("Ft and X", () => {
    const input = ["David - Play Ft Ne-Yo X Akon"];
    const output = [["David", "Ne-Yo", "Akon"], "Play"];
    expect(getFeaturedArtistsFromTitle(...input)).toEqual(output);
  });
  test("FEATURING", () => {
    const input = ["David - Play FEATURING Ne-Yo, Akon"];
    const output = [["David", "Ne-Yo", "Akon"], "Play"];
    expect(getFeaturedArtistsFromTitle(...input)).toEqual(output);
  });
  test(", in artistName and Ft at the end of name", () => {
    const input = ["Sly Kaz, Blakk Prince - 6 Ft"];
    const output = [["Sly Kaz", "Blakk Prince"], "6 Ft"];
    expect(getFeaturedArtistsFromTitle(...input)).toEqual(output);
  });
  test("Feat in title", () => {
    const input = ["Little Feat - Feats Don't Fail Me Now"];
    const output = [["Little Feat"], "Feats Don't Fail Me Now"];
    expect(getFeaturedArtistsFromTitle(...input)).toEqual(output);
  });
  test("Feat at the begining", () => {
    const input = ["Feat feat. 2pac - SKKR"];
    const output = [["Feat", "2pac"], "SKKR"];
    expect(getFeaturedArtistsFromTitle(...input)).toEqual(output);
  });
  test("Feat featuring someone", () => {
    const input = ["Feat si Jean de la Cracovia - Feat iar tarana usoara"];
    const output = [["Feat", "Jean de la Cracovia"], "Feat iar tarana usoara"];
    expect(getFeaturedArtistsFromTitle(...input)).toEqual(output);
  });
  test("Featuring in the beggining and some other stuff", () => {
    const input = [
      "[Featuring Jean de la Cracovia] si Dani Mocanu (spaima tuturor) - Feat iar tarna usoara",
    ];
    const output = [
      ["Jean de la Cracovia", "Dani Mocanu"],
      "Feat iar tarna usoara",
    ];
    expect(getFeaturedArtistsFromTitle(...input)).toEqual(output);
  });
  test("Featuring in the middle", () => {
    const input = ["JKKL - Fire FEATURING corcodan"];
    const output = [["JKKL", "corcodan"], "Fire"];
    expect(getFeaturedArtistsFromTitle(...input)).toEqual(output);
  });
  test("Feat. at the beggining", () => {
    const input = ["Feat - Feat. Jean de la Cracovia (Douazeci)"];
    const output = [["Feat", "Jean de la Cracovia"], ""];
    expect(getFeaturedArtistsFromTitle(...input)).toEqual(output);
  });
  test("using emojis", () => {
    const input = [
      "Marius Moga - Sunt prea nebun feat. Vasi \uD83C\uDF40 Cucu \uD83C\uDF40 Rodica",
    ];
    const output = [
      ["Marius Moga", "Vasi", "Cucu", "Rodica"],
      "Sunt prea nebun",
    ];
    expect(getFeaturedArtistsFromTitle(...input)).toEqual(output);
  });
  test("Featuring in artistName", () => {
    const input = ["Marius Featuring Moga - Sunt prea nebun"];
    const output = [["Marius", "Moga"], "Sunt prea nebun"];
    expect(getFeaturedArtistsFromTitle(...input)).toEqual(output);
  });
  test("ft in song name", () => {
    const input = ["Oarecare - I am 6ft tall"];
    const output = [["Oarecare"], "I am 6ft tall"];
    expect(getFeaturedArtistsFromTitle(...input)).toEqual(output);
  });
  test("No artist", () => {
    const input = ["Travesuras - Nicky Jam"];
    const output = [["Travesuras"], "Nicky Jam"];
    expect(getFeaturedArtistsFromTitle(...input)).toEqual(output);
  });
  test("No featuring artist", () => {
    const input = ["Where the Wild Wolves Have Gone", "Powerwolf Official"];
    const output = [["Powerwolf"], "Where the Wild Wolves Have Gone"];
    expect(getFeaturedArtistsFromTitle(...input)).toEqual(output);
  });
});
