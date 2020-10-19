import { REFRESH_TOKEN_KEY } from './constants';
import createToken from './createToken';
import { RefreshToken, AuthRefreshTokenPayload } from './Token.types';

const renewAuthRefreshToken = (
  userId: string, refreshTokenSecret: string, refreshTokenExpireTime: string,
): RefreshToken => {
  const refreshToken = createToken<AuthRefreshTokenPayload>({
    payload: { userId },
    secret: refreshTokenSecret,
    expireTime: refreshTokenExpireTime,
  });

  return {
    key: REFRESH_TOKEN_KEY,
    value: refreshToken,
  };
};

export default renewAuthRefreshToken;
