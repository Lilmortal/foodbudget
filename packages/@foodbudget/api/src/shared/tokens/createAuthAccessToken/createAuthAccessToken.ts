import { Config } from '../../../config';
import createToken from '../createToken';
import { AuthRefreshTokenPayload } from '../Token.types';

const createAuthAccessToken = (userId: string, config: Config): string => {
  const accessToken = createToken<AuthRefreshTokenPayload>({
    payload: { userId },
    secret: config.token.access.secret,
    expireTime: config.token.access.expireTime,
  });

  return accessToken;
};

export default createAuthAccessToken;
