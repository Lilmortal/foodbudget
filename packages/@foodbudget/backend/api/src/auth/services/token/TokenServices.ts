import { AppError } from '@foodbudget/errors';
import addMilliseconds from 'date-fns/addMilliseconds';
import { sign, verify } from 'jsonwebtoken';
import { TokenConfig, EnvConfig } from '../../../config';
import {
  AccessTokenPayload,
  RefreshToken,
  RefreshTokenPayload,
  Token,
} from './Token.types';

const createToken = <P extends object>({
  payload,
  secret,
  expireTimeInSeconds,
}: Token<P>): string => {
  const token = sign(payload, secret, { expiresIn: expireTimeInSeconds });
  return token;
};

interface RenewedTokenResponse {
  readonly accessToken: string;
  readonly refreshToken: RefreshToken;
}

interface TokenServicesInjection {
  readonly tokenConfig: TokenConfig;
}

export class TokenServices {
  private readonly tokenConfig: TokenConfig;

  private readonly REFRESH_TOKEN_KEY = 'refresh-token';

  constructor({ tokenConfig }: TokenServicesInjection) {
    this.tokenConfig = tokenConfig;
  }

  get refreshTokenKey(): string {
    return this.REFRESH_TOKEN_KEY;
  }

  isAccessToken = (token: unknown): token is AccessTokenPayload =>
    typeof token === 'object' &&
    (token as AccessTokenPayload).userId !== undefined &&
    typeof (token as AccessTokenPayload).userId === 'string' &&
    (token as AccessTokenPayload).scope !== undefined &&
    Array.isArray((token as AccessTokenPayload).scope) &&
    (token as AccessTokenPayload).expireTimeInUtc !== undefined &&
    typeof (token as AccessTokenPayload).expireTimeInUtc === 'string';

  isRefreshToken = (token: unknown): token is RefreshTokenPayload =>
    typeof token === 'object' &&
    (token as RefreshTokenPayload).userId !== undefined &&
    typeof (token as RefreshTokenPayload).userId === 'string';

  decodeAccessToken(accessToken: string): AccessTokenPayload {
    const decodedToken = verify(accessToken, this.tokenConfig.access.secret);

    if (typeof decodedToken === 'string') {
      throw new AppError({
        message: "decoded access token shouldn't be in string format.",
        isOperational: true,
        httpStatus: 401,
      });
    }

    if (!this.isAccessToken(decodedToken)) {
      throw new AppError({
        message: 'decoded token is not in access token format.',
        isOperational: true,
        httpStatus: 401,
      });
    }

    return decodedToken;
  }

  decodeRefreshToken(refreshToken: string): RefreshTokenPayload {
    const decodedToken = verify(refreshToken, this.tokenConfig.refresh.secret);

    if (typeof decodedToken === 'string') {
      throw new AppError({
        message: "decoded refresh token shouldn't be in string format.",
        isOperational: true,
        httpStatus: 401,
      });
    }

    if (!this.isRefreshToken(decodedToken)) {
      throw new AppError({
        message: 'decoded token is not in refresh token format.',
        isOperational: true,
        httpStatus: 401,
      });
    }

    return decodedToken;
  }

  // TODO: Add scope in the future
  createAccessToken(userId: string): string {
    const currentTime = Date.now();
    const expireTimeInMs = addMilliseconds(
      currentTime,
      this.tokenConfig.access.expireTimeInMs,
    );

    const accessToken = createToken<AccessTokenPayload>({
      payload: {
        userId,
        scope: [],
        expireTimeInUtc: expireTimeInMs.toUTCString(),
      },
      secret: this.tokenConfig.access.secret,
      expireTimeInSeconds: this.tokenConfig.access.expireTimeInMs / 1000,
    });

    return accessToken;
  }

  createRefreshToken(userId: string, env: EnvConfig): RefreshToken {
    const currentTime = Date.now();
    const expireTimeInMs = addMilliseconds(
      currentTime,
      this.tokenConfig.refresh.expireTimeInMs,
    );

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
        secure: env === 'production',
      },
    };
  }

  extractAccessToken(header: string): AccessTokenPayload {
    if (!header.startsWith('Bearer ')) {
      throw new AppError({
        message: 'Request header format is invalid.',
        isOperational: true,
        httpStatus: 401,
      });
    }

    const token = header.split(' ')[1];
    const decodedToken = this.decodeAccessToken(token);
    return decodedToken;
  }

  renewTokens(refreshToken: string, env: EnvConfig): RenewedTokenResponse {
    const decodedRefreshToken = this.decodeRefreshToken(refreshToken);

    const accessToken = this.createAccessToken(decodedRefreshToken.userId);
    const renewedRefreshToken = this.createRefreshToken(
      decodedRefreshToken.userId,
      env,
    );

    return {
      accessToken,
      refreshToken: renewedRefreshToken,
    };
  }
}
