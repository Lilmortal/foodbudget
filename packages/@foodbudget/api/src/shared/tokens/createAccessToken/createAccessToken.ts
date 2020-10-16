import { Config } from '../../../config';
import createToken from '../createToken';
import { RefreshToken } from '../Token.types';

// eslint-disable-next-line @typescript-eslint/ban-types
const createAccessToken = (userId: string, config: Config): string => {
  const accessToken = createToken<RefreshToken>({
    payload: { userId },
    secret: config.token.access.secret,
    expireTime: config.token.access.expireTime,
  });

  return accessToken;
};

export default createAccessToken;
