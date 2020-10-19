import { Response } from 'express';
import { REFRESH_TOKEN_KEY } from './constants';
import createToken from './createToken';
import { RefreshToken } from './Token.types';

const renewRefreshToken = (
  userId: string, res: Response, refreshTokenSecret: string, refreshTokenExpireTime: string,
): void => {
  const refreshToken = createToken<RefreshToken>({
    payload: { userId },
    secret: refreshTokenSecret,
    expireTime: refreshTokenExpireTime,
  });

  // TODO: return cookie object instead
  // secure if NODE_ENV is production
  res.cookie(REFRESH_TOKEN_KEY, refreshToken, { httpOnly: true });
};

export default renewRefreshToken;
