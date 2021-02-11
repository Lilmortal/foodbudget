import { AppError } from '@foodbudget/errors';
import { sign, verify } from 'jsonwebtoken';
import { TokenConfig } from '../../../config';
import {
  AccessTokenPayload,
  RefreshToken,
  RefreshTokenPayload,
} from './Token.types';
import { TokenServices } from './TokenServices';

const accessSecret = 'access secret';
const refreshSecret = 'refresh secret';

const defaultTokenConfig: TokenConfig = {
  access: {
    secret: accessSecret,
    expireTimeInMs: 50000,
  },
  refresh: {
    secret: refreshSecret,
    expireTimeInMs: 70000,
  },
};

const getTokenServices = (tokenConfig?: Partial<TokenConfig>) =>
  new TokenServices({ tokenConfig: { ...defaultTokenConfig, ...tokenConfig } });

describe('token services', () => {
  beforeEach(() => {
    jest.spyOn(global.Date, 'now').mockImplementation(() => 1604459767905);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should throw an error if access token does not have user ID', () => {
    const tokenServices = getTokenServices();

    const scope = ['READ'];
    const expireTimeInUtc = 'Wed, 04 Nov 2020 04:05:39 GMT';

    const accessToken = sign({ scope, expireTimeInUtc }, accessSecret);
    expect(() => tokenServices.decodeAccessToken(accessToken)).toThrowError(
      AppError,
    );
  });

  it('should throw an error if access token does not have a scope', () => {
    const tokenServices = getTokenServices();

    const userId = '4';
    const expireTimeInUtc = 'Wed, 04 Nov 2020 04:05:39 GMT';

    const accessToken = sign({ userId, expireTimeInUtc }, accessSecret);
    expect(() => tokenServices.decodeAccessToken(accessToken)).toThrowError(
      AppError,
    );
  });

  it('should throw an error if access token does not have expireTimeInUtc', () => {
    const tokenServices = getTokenServices();

    const userId = '4';
    const scope = ['READ'];

    const accessToken = sign({ userId, scope }, accessSecret);
    expect(() => tokenServices.decodeAccessToken(accessToken)).toThrowError(
      AppError,
    );
  });

  it('should decode access token', () => {
    const tokenServices = getTokenServices();

    const userId = '4';
    const scope = ['READ'];
    const expireTimeInUtc = 'Wed, 04 Nov 2020 04:05:39 GMT';

    const accessToken = sign({ userId, scope, expireTimeInUtc }, accessSecret);
    const decodedAccessToken = tokenServices.decodeAccessToken(accessToken);

    expect(decodedAccessToken.userId).toEqual(userId);
    expect(decodedAccessToken.scope).toEqual(scope);
    expect(decodedAccessToken.expireTimeInUtc).toEqual(expireTimeInUtc);
  });

  it('should throw an error if refresh token does not have user ID', () => {
    const tokenServices = getTokenServices();

    const refreshToken = sign({}, refreshSecret);
    expect(() => tokenServices.decodeRefreshToken(refreshToken)).toThrowError(
      AppError,
    );
  });

  it('should decode refresh token', () => {
    const tokenServices = getTokenServices();

    const userId = '4';

    const refreshToken = sign({ userId }, refreshSecret);
    const decodedRefreshToken = tokenServices.decodeRefreshToken(refreshToken);

    expect(decodedRefreshToken.userId).toEqual(userId);
  });

  it('should create access token', () => {
    const tokenServices = getTokenServices();

    const userId = '4';

    const accessToken = tokenServices.createAccessToken(userId);

    expect(accessToken).toEqual(
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI0Iiwic2NvcGUiOl' +
        'tdLCJleHBpcmVUaW1lSW5VdGMiOiJXZWQsIDA0IE5vdiAyMDIwIDAzOjE2OjU3IEdNVCIsImlhdCI6MTYwNDQ1OTc2Nyw' +
        'iZXhwIjoxNjA0NDU5ODE3fQ.VSSOdX1yUg2x7pSALSUaB1mq2MuqIWXTvbVbp1kfWTM',
    );
  });

  it('should verify access token userId is valid', () => {
    const tokenServices = getTokenServices();

    const userId = '4';

    const accessToken = tokenServices.createAccessToken(userId);

    const decodedAccessToken = verify(accessToken, accessSecret);
    expect((decodedAccessToken as AccessTokenPayload).userId).toEqual(userId);
  });

  it('should verify access token scope is valid', () => {
    const tokenServices = getTokenServices();

    const userId = '4';

    const accessToken = tokenServices.createAccessToken(userId);

    const decodedAccessToken = verify(accessToken, accessSecret);
    expect((decodedAccessToken as AccessTokenPayload).scope).toEqual([]);
  });

  it('should verify access token expireTimeInUtc is valid', () => {
    const tokenServices = getTokenServices();

    const userId = '4';

    const accessToken = tokenServices.createAccessToken(userId);

    const decodedAccessToken = verify(accessToken, accessSecret);
    expect((decodedAccessToken as AccessTokenPayload).expireTimeInUtc).toEqual(
      'Wed, 04 Nov 2020 03:16:57 GMT',
    );
  });

  it('should create refresh token', () => {
    const tokenServices = getTokenServices();

    const userId = '4';

    const refreshToken = tokenServices.createRefreshToken(
      userId,
      'development',
    );

    expect(refreshToken).toEqual({
      name: 'refresh-token',
      options: {
        expires: new Date('2020-11-04T03:17:17.905Z'),
        httpOnly: true,
        secure: false,
      },
      value:
        'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI0IiwiZXhwaXJlVGltZUluVXRjIjoiV2VkLCAwNCBOb3Yg' +
        'MjAyMCAwMzoxNzoxNyBHTVQiLCJpYXQiOjE2MDQ0NTk3NjcsImV4cCI6MTYwNDQ1OTgzN30.yBcGa3qAfNGouaR0YuQVLuKXJhT' +
        'FFMIdpXWJjSnz--U',
    });
  });

  it('should verify refresh token userId is valid', () => {
    const tokenServices = getTokenServices();

    const userId = '4';

    const refreshToken = tokenServices.createRefreshToken(
      userId,
      'development',
    );

    const decodedRefreshToken = verify(
      (refreshToken as RefreshToken).value,
      refreshSecret,
    );

    expect((decodedRefreshToken as RefreshTokenPayload).userId).toEqual(userId);
  });

  it('should verify refresh token expireTimeInUtc is valid', () => {
    const tokenServices = getTokenServices();

    const userId = '4';

    const refreshToken = tokenServices.createRefreshToken(
      userId,
      'development',
    );

    const decodedRefreshToken = verify(
      (refreshToken as RefreshToken).value,
      refreshSecret,
    );

    expect(
      (decodedRefreshToken as RefreshTokenPayload).expireTimeInUtc,
    ).toEqual('Wed, 04 Nov 2020 03:17:17 GMT');
  });

  it('should verify refresh token option is not secure if not on production', () => {
    const tokenServices = getTokenServices();

    const userId = '4';

    const refreshToken = tokenServices.createRefreshToken(
      userId,
      'development',
    );

    expect((refreshToken as RefreshToken).options.secure).toEqual(false);
  });

  it('should verify refresh token option is secure on production', () => {
    const tokenServices = getTokenServices();

    const userId = '4';

    const refreshToken = tokenServices.createRefreshToken(userId, 'production');

    expect((refreshToken as RefreshToken).options.secure).toEqual(true);
  });

  it('should throw an error if header is not valid when attempting to extract access token', () => {
    const tokenServices = getTokenServices();

    const header = 'invalid header';

    expect(() => tokenServices.extractAccessToken(header)).toThrowError(
      AppError,
    );
  });

  it('should extract access token', () => {
    const tokenServices = getTokenServices();

    // The JWT contains userId as 4
    const header =
      'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI0Iiwic2NvcGUiOl' +
      'tdLCJleHBpcmVUaW1lSW5VdGMiOiJXZWQsIDA0IE5vdiAyMDIwIDAzOjE2OjU3IEdNVCIsImlhdCI6MTYwNDQ1OTc2Nyw' +
      'iZXhwIjoxNjA0NDU5ODE3fQ.VSSOdX1yUg2x7pSALSUaB1mq2MuqIWXTvbVbp1kfWTM';

    const decodedAccessToken = tokenServices.extractAccessToken(header);
    expect((decodedAccessToken as AccessTokenPayload).userId).toEqual('4');
  });

  it('should renew tokens', () => {
    const tokenServices = getTokenServices();

    const refreshToken =
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI0IiwiZXhwaXJlVGltZUluVXRjIjoiV2VkLCAwNCBOb3Yg' +
      'MjAyMCAwMzoxNzoxNyBHTVQiLCJpYXQiOjE2MDQ0NTk3NjcsImV4cCI6MTYwNDQ1OTgzN30.yBcGa3qAfNGouaR0YuQVLuKXJhT' +
      'FFMIdpXWJjSnz--U';

    const results = tokenServices.renewTokens(refreshToken, 'development');

    expect(results).toEqual({
      accessToken:
        'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI0Iiwic2NvcGUiOltdLCJleHBpcmVUaW1l' +
        'SW5VdGMiOiJXZWQsIDA0IE5vdiAyMDIwIDAzOjE2OjU3IEdNVCIsImlhdCI6MTYwNDQ1OTc2NywiZXhwIjoxNjA0NDU5ODE3fQ' +
        '.VSSOdX1yUg2x7pSALSUaB1mq2MuqIWXTvbVbp1kfWTM',
      refreshToken: {
        name: 'refresh-token',
        options: {
          expires: new Date('2020-11-04T03:17:17.905Z'),
          httpOnly: true,
          secure: false,
        },
        value:
          'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI0IiwiZXhwaXJlVGltZUluVXRjIjoiV2VkLCAwNCBOb3Y' +
          'gMjAyMCAwMzoxNzoxNyBHTVQiLCJpYXQiOjE2MDQ0NTk3NjcsImV4cCI6MTYwNDQ1OTgzN30.yBcGa3qAfNGouaR0' +
          'YuQVLuKXJhTFFMIdpXWJjSnz--U',
      },
    });
  });
});
