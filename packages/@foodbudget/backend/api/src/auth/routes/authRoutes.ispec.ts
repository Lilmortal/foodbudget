import { CookieOptions } from 'express';
import { handleTokenVerification } from './authRoutes';
import { serviceManager } from '../../serviceManager';

const getTokenHandleFn = handleTokenVerification(serviceManager.tokenServices, serviceManager.authServices, 'development');

describe('auth routes', () => {
  let mockReq: jest.Mock;
  let mockRes: jest.Mock;

  beforeEach(() => {
    mockReq = jest.fn(() => ({
      user: {
        id: '1',
        strategy: 'google',
        email: 'email',
      },
    }));

    mockRes = jest.fn(() => ({
      cookie: (name: string, value: string, options: CookieOptions) => ({ name, value, options }),
    }));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  // TODO: Handle failure scenario

  it('should set the refresh tokens after logging in', () => {
    getTokenHandleFn(mockReq(), mockRes());

    expect(mockRes.mock.results[0].value).toEqual('');
  });
});
