import { Response } from 'express';
import config from '../../config';
import { REFRESH_TOKEN_KEY } from '../../loaders/auth/constants';
import createToken from './createToken';
import { RefreshToken } from './Token.types';

const renewRefreshToken = (userId: string, res: Response): void => {
  const refreshToken = createToken<RefreshToken>({
    payload: { userId },
    secret: config.token.refresh.secret,
    expireTime: config.token.refresh.expireTime,
  });

  // secure if NODE_ENV is production
  res.cookie(REFRESH_TOKEN_KEY, refreshToken, { httpOnly: true });
};

export default renewRefreshToken;
