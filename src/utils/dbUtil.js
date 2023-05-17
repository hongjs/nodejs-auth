import crypto from 'crypto';
import fs from 'fs';
import path from 'path';
import users from '../../database/users.json' assert { type: 'json' };
import { hashPassword } from './authUtils';

const userMap = new Map(users.map((i) => [i.email, i]));

const removeCredential = (user) => {
  if (!user) return undefined;
  const { password, salt, ...obj } = user;
  return obj;
};

export const hasUser = async (email) => {
  return userMap.has(email);
};

export const getUserById = async (id) => {
  const user = [...userMap].find((i) => {
    return i[1].id === id;
  });
  if (user) return removeCredential(user[1]);
};
export const findUsers = async (keyword) => {
  if (!keyword) return [...userMap].map((i) => removeCredential(i[1]));

  const regex = new RegExp(keyword, 'i');
  const users = [...userMap]
    .filter((i) => {
      return ['name', 'email'].some((k) => regex.test(i[1][k]));
    })
    .map((i) => {
      return removeCredential(i[1]);
    });

  return users;
};

export const getUser = async (email) => {
  if (userMap.has(email)) {
    const user = removeCredential(userMap.get(email));
    return user;
  }
  return null;
};

const writeFile = async () => {
  const absolutePath = path.resolve('./database');
  const jsonData = JSON.stringify([...userMap].map((user) => user[1]));
  await fs.promises.writeFile(`${absolutePath}/users.json`, jsonData, 'utf8');
};

export const addUser = async (email, password, name) => {
  const id = crypto.randomBytes(16).toString('hex');
  const salt = crypto.randomBytes(16).toString('hex');
  const hashedPassword = hashPassword(password, salt);
  const user = { id, email, password: hashedPassword, name, salt };
  userMap.set(id, user);
  writeFile();
  return removeCredential(user);
};

export const updateUser = async (email, name) => {
  const user = userMap.get(email);
  user.name = name;
  userMap.set(email, user);
  writeFile();
  return removeCredential(user);
};

export const deleteUser = async (email) => {
  if (userMap.has(email)) {
    if (!userMap.get(email).superAdmin) {
      userMap.delete(email);
      writeFile();
    }
  }
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
  getUserById,
  findUsers,
  getUserCredential,
  addUser,
  updateUser,
  deleteUser,
};
