export const getCombinations = (array) => {
  const combinations = [];
  const getCombinationsRecursive = (remainderofArray, prefix = []) => {
    remainderofArray.forEach((element, index) => {
      const combination = [...prefix, element];
      const remainderOfArrayArgument = remainderofArray.slice(index + 1);
      combinations.push(combination);
      getCombinationsRecursive(remainderOfArrayArgument, combination);
    });
  };
  getCombinationsRecursive(array);
  return combinations;
};
