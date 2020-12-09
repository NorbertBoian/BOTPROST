import stringSimilarity from "string-similarity";
const test = () => {
  const answers = [
    "David Guetta",
    "Rihanna",
    "Eminem",
    "Tiesto",
    "Smiley",
    "Andra",
    "Love the way you lie",
  ];
  const a = "A very wise man once did something cool";
  const b = "A very wise man once did something cool";
  const c = "something wise very man did A cool once";
  const bCoef = stringSimilarity.compareTwoStrings(a, b);
  const cCoef = stringSimilarity.compareTwoStrings(a, c);
  // console.log(`b: ${bCoef} || c: ${cCoef}`);
  const result = [];
  // const f = (array) => {
  // array.forEach((element, index) => {
  //   result.push([element]);
  //   if (index !== array.length - 1)
  //     result.push([element, ...array.slice(index + 1)]);
  // const g=(arr)=>{
  // }
  // result.push(array.slice(index + 2));
  // });
  const f = (arr, p = []) => {
    arr.forEach((el, i) => {
      result.push([...p, el]);
      f(arr.slice(i + 1), [...p, el]);
    });
  };
  // array.forEach((el, index) => {
  //   result.push([el]);
  //   for (let i = index + 1; i <= array.length - 1; i++) {
  //     result.push([el, ...array.slice(i)]);
  //   }
  // });
  // };

  const combinations = [];
  const getCombinationsRecursive = (remainderofArray, prefix = []) => {
    remainderofArray.forEach((element, index) => {
      const combination = [...prefix, element];
      const remainderOfArrayArgument = remainderofArray.slice(index + 1);
      combinations.push(combination);
      getCombinationsRecursive(remainderOfArrayArgument, combination);
    });
  };
  getCombinationsRecursive(answers);
  f(answers);
  console.log(result.length);
  // console.log(combinations.sort());
};
test();
