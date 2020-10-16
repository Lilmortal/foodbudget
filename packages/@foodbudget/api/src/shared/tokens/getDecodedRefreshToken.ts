import { verify } from 'jsonwebtoken';
import { Request } from 'express';
import { RefreshToken } from './Token.types';
import isRefreshTokenValid from './isRefreshTokenValid';
import { REFRESH_TOKEN_KEY } from './constants';

const getDecodedRefreshToken = (req: Request, refreshTokenSecret: string): RefreshToken => {
  const refreshToken = req.cookies[REFRESH_TOKEN_KEY];

  const decodedRefreshToken = verify(refreshToken, refreshTokenSecret);

  if (isRefreshTokenValid(decodedRefreshToken)) {
    return decodedRefreshToken;
  }

  throw new Error('refresh token is invalid.');
};

export default getDecodedRefreshToken;
