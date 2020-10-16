import { verify } from 'jsonwebtoken';
import { Request } from 'express';
import { RefreshToken } from './Token.types';
import isRefreshTokenValid from './isRefreshTokenValid';
import { REFRESH_TOKEN_KEY } from '../../loaders/auth/constants';
import config from '../../config';

const getDecodedRefreshToken = (req: Request): RefreshToken => {
  const refreshToken = req.cookies[REFRESH_TOKEN_KEY];

  const decodedRefreshToken = verify(refreshToken, config.token.refresh.secret);

  if (isRefreshTokenValid(decodedRefreshToken)) {
    return decodedRefreshToken;
  }

  throw new Error('refresh token is invalid.');
};

export default getDecodedRefreshToken;
