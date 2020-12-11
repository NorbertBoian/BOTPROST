export const updateUser = (users, userIndex, key, value) => {
  const userObject = users[userIndex];
  users[userIndex] = {
    ...userObject,
    [key]: key === "score" ? userObject[key] + value : value,
  };
  return users;
};
