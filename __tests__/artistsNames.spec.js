const {
  getSongAndArtistsFromTitle,
} = require("../src/controllers/quiz/functions/getSongAndArtistsFromTitle");

describe("getFeaturedArtist", () => {
  test("ft. and ,", () => {
    const input = ["David - Play ft. Ne-Yo, Akon"];
    const output = [["David", "Ne-Yo", "Akon"], "Play"];
    expect(getSongAndArtistsFromTitle(...input)).toEqual(output);
  });
  test("feat. in () and &", () => {
    const input = ["David - Play (feat. Ne-Yo & Akon)"];
    const output = [["David", "Ne-Yo", "Akon"], "Play"];
    expect(getSongAndArtistsFromTitle(...input)).toEqual(output);
  });
  test("Feat. in [] and and", () => {
    const input = ["David - Play [Feat.Ne-Yo and Akon]"];
    const output = [["David", "Ne-Yo", "Akon"], "Play"];
    expect(getSongAndArtistsFromTitle(...input)).toEqual(output);
  });
  test("Ft. and x", () => {
    const input = ["David - Play Ft. Ne-Yo x Akon"];
    const output = [["David", "Ne-Yo", "Akon"], "Play"];
    expect(getSongAndArtistsFromTitle(...input)).toEqual(output);
  });
  test("FT. and AND and hyphen in name", () => {
    const input = ["David - Play FT. Ne-Yo AND Akon"];
    const output = [["David", "Ne-Yo", "Akon"], "Play"];
    expect(getSongAndArtistsFromTitle(...input)).toEqual(output);
  });
  test("Ft and X", () => {
    const input = ["David - Play Ft Ne-Yo X Akon"];
    const output = [["David", "Ne-Yo", "Akon"], "Play"];
    expect(getSongAndArtistsFromTitle(...input)).toEqual(output);
  });
  test("FEATURING", () => {
    const input = ["David - Play FEATURING Ne-Yo, Akon"];
    const output = [["David", "Ne-Yo", "Akon"], "Play"];
    expect(getSongAndArtistsFromTitle(...input)).toEqual(output);
  });
  test(", in artistName and Ft at the end of name", () => {
    const input = ["Sly Kaz, Blakk Prince - 6 Ft"];
    const output = [["Sly Kaz", "Blakk Prince"], "6 Ft"];
    expect(getSongAndArtistsFromTitle(...input)).toEqual(output);
  });
  test("Feat in title", () => {
    const input = ["Little Feat - Feats Don't Fail Me Now"];
    const output = [["Little Feat"], "Feats Don't Fail Me Now"];
    expect(getSongAndArtistsFromTitle(...input)).toEqual(output);
  });
  test("Feat at the begining", () => {
    const input = ["Feat feat. 2pac - SKKR"];
    const output = [["Feat", "2pac"], "SKKR"];
    expect(getSongAndArtistsFromTitle(...input)).toEqual(output);
  });
  test("Feat featuring someone", () => {
    const input = ["Feat si Jean de la Cracovia - Feat iar tarana usoara"];
    const output = [["Feat", "Jean de la Cracovia"], "Feat iar tarana usoara"];
    expect(getSongAndArtistsFromTitle(...input)).toEqual(output);
  });
  test("Featuring in the beggining and some other stuff", () => {
    const input = [
      "[Featuring Jean de la Cracovia] si Dani Mocanu (spaima tuturor) - Feat iar tarna usoara",
    ];
    const output = [
      ["Jean de la Cracovia", "Dani Mocanu"],
      "Feat iar tarna usoara",
    ];
    expect(getSongAndArtistsFromTitle(...input)).toEqual(output);
  });
  test("Featuring in the middle", () => {
    const input = ["JKKL - Fire FEATURING corcodan"];
    const output = [["JKKL", "corcodan"], "Fire"];
    expect(getSongAndArtistsFromTitle(...input)).toEqual(output);
  });
  test("Same artists in both song and artist and some more", () => {
    const input = [
      "JKKL X mArus X Pegasus - Feat 6ft FEATURING feat.Mike & mArus",
    ];
    const output = [["JKKL", "mArus", "Pegasus", "Mike"], "Feat 6ft"];
    expect(getSongAndArtistsFromTitle(...input)).toEqual(output);
  });
  test("Feat. at the beggining", () => {
    const input = ["Feat - Feat. Jean de la Cracovia (Douazeci)"];
    const output = [["Feat", "Jean de la Cracovia"], ""];
    expect(getSongAndArtistsFromTitle(...input)).toEqual(output);
  });
  test("using emojis", () => {
    const input = [
      "Marius Moga - Sunt prea nebun feat. Vasi \uD83C\uDF40 Cucu \uD83C\uDF40 Rodica",
    ];
    const output = [
      ["Marius Moga", "Vasi", "Cucu", "Rodica"],
      "Sunt prea nebun",
    ];
    expect(getSongAndArtistsFromTitle(...input)).toEqual(output);
  });
  test("Featuring in artistName", () => {
    const input = ["Marius Featuring Moga - Sunt prea nebun"];
    const output = [["Marius", "Moga"], "Sunt prea nebun"];
    expect(getSongAndArtistsFromTitle(...input)).toEqual(output);
  });
  test("Featuring in artistName and in parenthesis", () => {
    const input = ["mArus (Featuring Moga) - Sunt prea nebun"];
    const output = [["mArus", "Moga"], "Sunt prea nebun"];
    expect(getSongAndArtistsFromTitle(...input)).toEqual(output);
  });
  test("ft in song name", () => {
    const input = ["Oarecare - I am 6ft tall"];
    const output = [["Oarecare"], "I am 6ft tall"];
    expect(getSongAndArtistsFromTitle(...input)).toEqual(output);
  });
  test("No artist", () => {
    const input = ["Nicky Jam"];
    const output = [[], "Nicky Jam"];
    expect(getSongAndArtistsFromTitle(...input)).toEqual(output);
  });
  test("No artist and featured in songName", () => {
    const input = ["Ce-mi mai place femeile feat. Moldoveanu"];
    const output = [["Moldoveanu"], "Ce-mi mai place femeile"];
    expect(getSongAndArtistsFromTitle(...input)).toEqual(output);
  });
  test("feat in parenthesis in songName", () => {
    const input = ["Connect-R - Daca Dragostea Dispare (feat Alex)"];
    const output = [["Connect-R", "Alex"], "Daca Dragostea Dispare"];
    expect(getSongAndArtistsFromTitle(...input)).toEqual(output);
  });
  test("idk1", () => {
    const input = [
      "MACKLEMORE & RYAN LEWIS - THRIFT SHOP FEAT. WANZ (OFFICIAL VIDEO)",
    ];
    const output = [["MACKLEMORE", "RYAN LEWIS", "WANZ"], "THRIFT SHOP"];
    expect(getSongAndArtistsFromTitle(...input)).toEqual(output);
  });
  test("idk2", () => {
    const input = ["ADDA - Lupii (Nu plange, ADDA - 2016)"];
    const output = [["ADDA"], "Lupii"];
    expect(getSongAndArtistsFromTitle(...input)).toEqual(output);
  });
  test("idk3", () => {
    const input = ["G-Eazy x Bebe Rexha - Me, Myself & I"];
    const output = [["G-Eazy", "Bebe Rexha"], "Me, Myself & I"];
    expect(getSongAndArtistsFromTitle(...input)).toEqual(output);
  });
  test("idk4", () => {
    const input = ["Jonas Brothers - SOS Music Video - Official (HQ)"];
    const output = [["Jonas Brothers"], "SOS"];
    expect(getSongAndArtistsFromTitle(...input)).toEqual(output);
  });
  test("idk5", () => {
    const input = [
      "Marshmello & Anne-Marie - FRIENDS (Lyric Video) *OFFICIAL FRIENDZONE ANTHEM*",
    ];
    const output = [["Marshmello", "Anne-Marie"], "FRIENDS"];
    expect(getSongAndArtistsFromTitle(...input)).toEqual(output);
  });
  test("idk6", () => {
    const input = ["Adele performing Someone Like You | BRIT Awards 2011"];
    const output = [["Adele"], "Someone Like You"];
    expect(getSongAndArtistsFromTitle(...input)).toEqual(output);
  });
  test("idk7", () => {
    const input = [
      "G-Eazy - No Limit REMIX ft. A$AP Rocky, Cardi B, French Montana, Juicy J, Belly",
    ];
    const output = [
      ["G-Eazy", "A$AP Rocky", "Cardi B", "French Montana", "Juicy J", "Belly"],
      "No Limit",
    ];
    expect(getSongAndArtistsFromTitle(...input)).toEqual(output);
  });
  test("idk8", () => {
    const input = [
      "Sensualidad - Bad Bunny X Prince Royce X J Balvin X Dj Luian X Mambo Kingz",
    ];
    const output = [
      ["Sensualidad", "Prince Royce", "J Balvin", "Dj Luian", "Mambo Kingz"],
      "Bad Bunny",
    ];
    expect(getSongAndArtistsFromTitle(...input)).toEqual(output);
  });
  test("idk9", () => {
    const input = ["Doar Tu [MANDINGA feat CONNECT-R]"];
    const output = [["CONNECT-R"], "Doar Tu"];
    expect(getSongAndArtistsFromTitle(...input)).toEqual(output);
  });
  test("idk10", () => {
    const input = [
      "Sensualidad - Bad Bunny 🌎 Prince Royce 🔥 J Balvin 🌪 Dj Luian ☀ Mambo Kingz",
    ];
    const output = [
      ["Sensualidad", "Prince Royce", "J Balvin", "Dj Luian", "Mambo Kingz"],
      "Bad Bunny",
    ];
    expect(getSongAndArtistsFromTitle(...input)).toEqual(output);
  });
  test("No artist \\w channel", () => {
    const input = ["Where the Wild Wolves Have Gone", "Powerwolf Official"];
    const output = [["Powerwolf"], "Where the Wild Wolves Have Gone"];
    expect(getSongAndArtistsFromTitle(...input)).toEqual(output);
  });
});
