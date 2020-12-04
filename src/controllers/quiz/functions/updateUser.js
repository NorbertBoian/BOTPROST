export const updateUser = (users, userIndex, key, value) => {
  const userObject = users[userIndex];
  users[userIndex] = {
    ...userObject,
    [key]: userObject[key] + value,
  };
  return users;
};
