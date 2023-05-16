import _ from 'lodash';
import { Buffer } from 'buffer';
import crypto from 'crypto';
import jwt from 'jsonwebtoken';
import constants from '../config/constants';

export const serializeUser = (payload) => {
  const token = signJwt(payload, constants.JWTExpiry || '7d');
  return token;
};

export const deserializeUser = (token) => {
  const decoded = verifyJwt(token);
  return decoded;
};

const signJwt = (payload, expiresIn) => {
  const token = jwt.sign(payload, constants.jwtSecret, {
    expiresIn: expiresIn ?? '7d',
  });
  return encrypt(token);
};

const verifyJwt = (encryptedToken) => {
  const jwtToken = decrypt(encryptedToken);
  const decoded = jwt.verify(jwtToken, constants.jwtSecret);
  return decoded;
};

const encrypt = (text) => {
  const { algorithm, key, iv } = getConfig();
  const cipher = crypto.createCipheriv(algorithm, key, iv);
  let encrypted = cipher.update(text, 'utf8', 'hex');
  encrypted += cipher.final('hex');
  const encryptedBuffer = Buffer.from(encrypted, 'hex');
  // Concat vi+encrypted => send to client
  const encryptedWithIV = Buffer.concat([iv, encryptedBuffer]).toString('hex');
  return encryptedWithIV;
};

const decrypt = (encryptedWithIV) => {
  const { algorithm, key, ivLength } = getConfig();
  // client need vi+encrypted to decrypt a token
  const data = Buffer.from(encryptedWithIV, 'hex');
  const iv = Buffer.from(data.slice(0, ivLength));
  const encryptedData = Buffer.from(data.slice(ivLength));
  const encryptedDataString = encryptedData.toString('hex');
  const decipher = crypto.createDecipheriv(algorithm, key, iv);
  let decrypted = decipher.update(encryptedDataString, 'hex', 'utf8');
  decrypted += decipher.final('utf8');
  return decrypted;
};

export function hashPassword(password, salt) {
  const hash = crypto
    .pbkdf2Sync(password, salt, 1000, 64, 'sha512')
    .toString('hex');
  return hash;
}

export function comparePassword(plainPassword, hashedPassword, salt) {
  const hash = hashPassword(plainPassword, salt);
  return hash === hashedPassword;
}

const getConfig = () => {
  if (constants.jwtEncryptSecret.length !== 32) {
    throw 'Invalid secret-key length, key must equals to 32 bytes.';
  }
  const ivLength = 16;
  return {
    algorithm: 'aes-256-cbc',
    key: Buffer.from(constants.jwtEncryptSecret),
    iv: crypto.randomBytes(ivLength),
    ivLength,
  };
};

export default {
  serializeUser,
  deserializeUser,
  hashPassword,
  comparePassword,
};
