import * as jwt from 'jsonwebtoken';
import config from './config';
import { User } from '@pdeals/models/entities/User';

export const generateToken = (user: User): string => {
  const token = jwt.sign(
    {
      id: user.id,
      email: user.email,
    },
    config.jwt_secret,
    {
      expiresIn: '5y',
    }
  );

  return token;
};

export const getUserIdFromToken = (token: string): number | null => {
  token = token.replace('Bearer ', '');
  const tokenDecoded = jwt.decode(token, { json: true });
  if (tokenDecoded) {
    return tokenDecoded.id;
  } else {
    return null;
  }
};
