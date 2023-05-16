import users from '../../database/users.json' assert { type: 'json' };

const userMap = new Map(users.map((i) => [i.username, i]));

const hasUser = async (username) => {
  return userMap.has(username);
};

const getUser = (username) => {
  if (userMap.has(username)) {
    const { password, salt, ...user } = userMap.get(username);
    return user;
  }
  return null;
};

const getUserCredential = (username) => {
  if (userMap.has(username)) {
    const user = userMap.get(username);
    return { hashedPassword: user.password, salt: user.salt };
  }
  return null;
};

export default {
  hasUser,
  getUser,
  getUserCredential,
};
