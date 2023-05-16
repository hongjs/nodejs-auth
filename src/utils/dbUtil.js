import crypto from 'crypto';
import fs from 'fs';
import path from 'path';
import users from '../../database/users.json' assert { type: 'json' };
import { hashPassword } from './authUtils';

const userMap = new Map(users.map((i) => [i.email, i]));

const removeCredential = (user) => {
  const { password, salt, ...obj } = user;
  return obj;
};

export const hasUser = (email) => {
  return userMap.has(email);
};

export const getUsers = (filter) => {
  return [...userMap].map((user) => {
    return removeCredential(user[1]);
  });
};

export const getUser = (email) => {
  if (userMap.has(email)) {
    const user = removeCredential(userMap.get(email));
    return user;
  }
  return null;
};

export const addUser = async (email, password, name) => {
  const id = crypto.randomBytes(16).toString('hex');
  const salt = crypto.randomBytes(16).toString('hex');
  const hashedPassword = hashPassword(password, salt);
  const user = { id, email, password: hashedPassword, name, salt };
  userMap.set(id, user);

  const jsonData = JSON.stringify([...userMap].map((user) => user[1]));
  const absolutePath = path.resolve('./database');

  fs.writeFile(`${absolutePath}/users.json`, jsonData, 'utf8', (err) => {
    if (err) {
      console.error('Error writing to file:', err);
    } else {
      console.log('Data written to file successfully.');
    }
  });

  return removeCredential(user);
};

export const getUserCredential = (email) => {
  if (userMap.has(email)) {
    const user = userMap.get(email);
    return { hashedPassword: user.password, salt: user.salt };
  }
  return null;
};

export default {
  hasUser,
  getUser,
  getUsers,
  getUserCredential,
  addUser,
};
