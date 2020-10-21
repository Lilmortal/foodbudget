import { AppError } from '@foodbudget/errors';
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

    isAccessToken = (token: unknown): token is AccessTokenPayload => typeof token === 'object'
    && (token as AccessTokenPayload).userId !== undefined && typeof (token as AccessTokenPayload).userId === 'string'
    && (token as AccessTokenPayload).scope !== undefined && Array.isArray((token as AccessTokenPayload).scope)
    && (token as AccessTokenPayload).expireTimeInUtc !== undefined
    && typeof (token as AccessTokenPayload).expireTimeInUtc === 'string';

    isRefreshToken = (token: unknown): token is RefreshTokenPayload => typeof token === 'object'
    && (token as RefreshTokenPayload).userId !== undefined && typeof (token as RefreshTokenPayload).userId === 'string';

    decodeAccessToken(accessToken: string): AccessTokenPayload {
      let decodedToken: string | object;
      try {
        decodedToken = verify(accessToken, this.tokenConfig.access.secret);
      } catch (err) {
        throw new AppError({ message: `access token is in invalid format.\n${err}`, isOperational: true, httpStatus: 401 });
      }

      if (typeof decodedToken === 'string') {
        throw new AppError(
          { message: "decoded access token shouldn't be in string format.", isOperational: true, httpStatus: 401 },
        );
      }

      if (!this.isAccessToken(decodedToken)) {
        throw new AppError(
          { message: 'decoded token is not in access token format.', isOperational: true, httpStatus: 401 },
        );
      }

      return decodedToken;
    }

    decodeRefreshToken(refreshToken: string): RefreshTokenPayload {
      let decodedToken: string | object;
      try {
        decodedToken = verify(refreshToken, this.tokenConfig.refresh.secret);
      } catch (err) {
        throw new AppError({ message: `refresh token is in invalid format.\n${err}`, isOperational: true, httpStatus: 401 });
      }

      if (typeof decodedToken === 'string') {
        throw new AppError(
          { message: "decoded refresh token shouldn't be in string format.", isOperational: true, httpStatus: 401 },
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

      const accessToken = createToken<AccessTokenPayload>({
        payload: { userId, scope: [], expireTimeInUtc: expireTimeInMs.toUTCString() },
        secret: this.tokenConfig.access.secret,
        expireTimeInSeconds: this.tokenConfig.access.expireTimeInMs / 1000,
      });

      return accessToken;
    }

    createRefreshToken(userId: string): RefreshToken {
      const currentTime = Date.now();
      const expireTimeInMs = addMilliseconds(currentTime, this.tokenConfig.refresh.expireTimeInMs);

      const refreshToken = createToken<RefreshTokenPayload>({
        payload: { userId, expireTimeInUtc: expireTimeInMs.toUTCString() },
        secret: this.tokenConfig.refresh.secret,
        expireTimeInSeconds: this.tokenConfig.refresh.expireTimeInMs / 1000,
      });

      return {
        name: this.refreshTokenKey,
        value: refreshToken,
        options: {
          httpOnly: true,
          expires: new Date(expireTimeInMs),
          secure: process.env.NODE_ENV === 'production',
        },
      };
    }

    extractAccessToken(header: string): AccessTokenPayload {
      if (!header.startsWith('Bearer ')) {
        throw new AppError({ message: 'Request header format is invalid.', isOperational: true, httpStatus: 401 });
      }

      const token = header.substring(7);
      const decodedToken = this.decodeAccessToken(token);
      return decodedToken;
    }
}
