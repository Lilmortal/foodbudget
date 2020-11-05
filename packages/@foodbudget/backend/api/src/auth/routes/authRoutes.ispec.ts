import { CookieOptions } from 'express';
import { handleTokenVerification } from './authRoutes';
import { serviceManager } from '../../serviceManager';
import { TokenServices } from '../services';
import { TokenConfig } from '../../config';

const mockTokenConfig: TokenConfig = {
  access: {
    secret: 'access secret key',
    expireTimeInMs: 50000,
  },
  refresh: {
    secret: 'refresh secret key',
    expireTimeInMs: 60000,
  },
};

const mockTokenServices = new TokenServices({ tokenConfig: mockTokenConfig });

const getTokenHandleFn = handleTokenVerification(mockTokenServices, serviceManager.authServices, 'development');

describe('auth routes', () => {
  let mockReq: jest.Mock;
  let mockRes: jest.Mock;

  beforeEach(() => {
    mockReq = jest.fn(() => ({
      user: {
        id: '1',
        strategy: 'google',
        email: 'email@gmail.com',
      },
    }));

    mockRes = jest.fn(() => ({
      cookie: jest.fn(() => (name: string, value: string, options: CookieOptions) => ({ name, value, options })),
    }));

    jest.spyOn(global.Date, 'now').mockImplementation(() => 1604459767905);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  // TODO: Handle failure scenario

  it('should set the refresh tokens after logging in', async () => {
    await getTokenHandleFn(mockReq(), mockRes());

    expect(mockRes.mock.results[0].value.cookie.mock.calls).toEqual([['refresh-token',
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiIxIiwiZXhwaXJlVGltZUluVXRjIjoiV2VkLCAwNCBOb3YgMjAyM'
    + 'CAwMzoxNzowNyBHTVQiLCJpYXQiOjE2MDQ0NTk3NjcsImV4cCI6MTYwNDQ1OTgyN30.Ee-Oh7vQzh1N23c3ZZ7kqn4vfZXUiHZ7pIMCB9TQ7Xs',
      {
        expires: new Date('2020-11-04T03:17:07.905Z'),
        httpOnly: true,
        secure: false,
      }]]);
  });
});
