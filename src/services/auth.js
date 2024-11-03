import createHttpError from 'http-errors';
import bcrypt from 'bcrypt';
import { randomBytes } from 'crypto';

import SessionCollection from '../bd/models/Session.js';

import UserCollection from '../bd/models/User.js';

import {
  accessTokenLifeTime,
  refreshTokenLifeTime,
} from '../constants/users.js';

const createSession = () => {
  const accessToken = randomBytes(30).toString('base64');
  const refreshToken = randomBytes(30).toString('base64');
  const accessTokenValidUntil = Date.now() + accessTokenLifeTime;
  const refreshTokenValidUntil = Date.now() + refreshTokenLifeTime;

  return {
    accessToken,
    refreshToken,
    accessTokenValidUntil,
    refreshTokenValidUntil,
  };
};

export const register = async (payload) => {
  const { email, password } = payload;
  const user = await UserCollection.findOne({ email });
  if (user) {
    throw createHttpError(409, 'Email already exist');
  }

  const hashPassword = await bcrypt.hash(password, 10);
  return await UserCollection.create({ ...payload, password: hashPassword });
};

export const login = async (payload) => {
  const { email, password } = payload;
  const user = await UserCollection.findOne({ email });
  if (!user) {
    throw createHttpError(401, 'email or password invalid');
  }
  const passwordCompare = await bcrypt.compare(password, user.password);
  if (!passwordCompare) {
    throw createHttpError(401, 'email or password invalid');
  }

  await SessionCollection.deleteOne({ userId: user._id });

  const newSession = createSession();

  return await SessionCollection.create({
    userId: user._id,
    ...newSession,
  });
};

export const refreshSession = async (sessionId, refreshToken) => {
  const oldSession = await SessionCollection.findOne({
    id: sessionId,
    refreshToken,
  });
  if (!oldSession) {
    throw createHttpError(401, 'Session not found');
  }

  if (Date.now() > oldSession.refreshTokenValidUntil) {
    throw createHttpError(401, 'Refresh token expired');
  }

  await SessionCollection.deleteOne({ _id: sessionId });

  const newSession = createSession();

  return await SessionCollection.create({
    userId: oldSession._id,
    ...newSession,
  });
};

export const logout = async (sessionId) => {
  await SessionCollection.deleteOne({ _id: sessionId });
};

export const findSession = (filter) => SessionCollection.findOne(filter);

export const findUser = (filter) => UserCollection.findOne(filter);
