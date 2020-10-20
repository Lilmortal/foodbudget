import { AppError } from '@foodbudget/errors';
import { addSeconds } from 'date-fns';
import addMilliseconds from 'date-fns/addMilliseconds';
import { sign, verify } from 'jsonwebtoken';
import { TokenConfig } from '../config';
import {
  AccessTokenPayload, RefreshToken, RefreshTokenPayload, Token,
} from './Auth.types';

const createToken = <P extends object>({ payload, secret, expireTimeInSeconds }: Token<P>): string => {
  const token = sign(payload, secret, { expiresIn: expireTimeInSeconds });
  return token;
};

export default class AuthServices {
    private readonly tokenConfig: TokenConfig;

    private readonly REFRESH_TOKEN_KEY = 'refresh-token';

    constructor(tokenConfig: TokenConfig) {
      this.tokenConfig = tokenConfig;
    }

    get refreshTokenKey(): string {
      return this.REFRESH_TOKEN_KEY;
    }

    isRefreshToken = (token: unknown): token is RefreshTokenPayload => typeof token === 'object'
    && (token as RefreshTokenPayload).userId !== undefined && typeof (token as RefreshTokenPayload).userId === 'string';

    decodeRefreshToken(refreshToken: string): RefreshTokenPayload {
      const decodedToken = verify(refreshToken, this.tokenConfig.refresh.secret);

      if (typeof decodedToken === 'string') {
        throw new AppError(
          { message: "decoded token shouldn't be in string format.", isOperational: true, httpStatus: 401 },
        );
      }

      if (!this.isRefreshToken(decodedToken)) {
        throw new AppError(
          { message: 'decoded token is not in refresh token format.', isOperational: true, httpStatus: 401 },
        );
      }

      return decodedToken;
    }

    createAccessToken(userId: string): string {
      const currentTime = Date.now();
      const expireTimeInMs = addMilliseconds(currentTime, this.tokenConfig.access.expireTimeInMs);
      const expireTimeInSeconds = addSeconds(currentTime, this.tokenConfig.access.expireTimeInMs / 1000);

      const accessToken = createToken<AccessTokenPayload>({
        payload: { userId, scope: [], expireTimeInUtc: expireTimeInMs.toUTCString() },
        secret: this.tokenConfig.access.secret,
        expireTimeInSeconds: expireTimeInSeconds.getTime(),
      });

      return accessToken;
    }

    createRefreshToken(userId: string): RefreshToken {
      const currentTime = Date.now();
      const expireTimeInMs = addMilliseconds(currentTime, this.tokenConfig.refresh.expireTimeInMs);
      const expireTimeInSeconds = addSeconds(currentTime, this.tokenConfig.refresh.expireTimeInMs / 1000);

      const refreshToken = createToken<RefreshTokenPayload>({
        payload: { userId, expireTimeInUtc: expireTimeInMs.toUTCString() },
        secret: this.tokenConfig.refresh.secret,
        expireTimeInSeconds: expireTimeInSeconds.getTime(),
      });

      return {
        name: this.refreshTokenKey,
        value: refreshToken,
        options: {
          httpOnly: true,
        },
      };
    }
}
