import { Profile } from 'passport';
import { VerifyCallback } from 'passport-google-oauth20';
import { handleTokenStrategy } from './socialTokenStrategyHandler';
import { Strategy } from '../routes';

describe('social token strategy handler', () => {
  const getTokenHandleFn = (
    strategy: Strategy,
    profile: Profile,
    done: VerifyCallback,
  ) => handleTokenStrategy(strategy)('', '', profile, done);

  let mockDone: jest.Mock;

  beforeEach(() => {
    mockDone = jest.fn((err?: string | Error, user?: object) => ({
      err,
      ...user,
    }));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should return an error if email could not be found', () => {
    const profile: Profile = {
      emails: [{ value: '' }],
      id: '1',
      provider: '',
      displayName: '',
    };

    getTokenHandleFn('google', profile, mockDone);

    expect(mockDone.mock.results[0].value.err).toEqual(
      new Error('emails could not be retrieved.'),
    );
  });

  it('should return an error if multiple emails found', () => {
    const profile: Profile = {
      emails: [{ value: 'email1' }, { value: 'email2' }],
      id: '1',
      provider: '',
      displayName: '',
    };

    getTokenHandleFn('google', profile, mockDone);

    expect(mockDone.mock.results[0].value.err).toEqual(
      new Error('multiple emails found.'),
    );
  });

  it('should return an error if profile ID could not be found', () => {
    const profile: Profile = {
      emails: [{ value: 'email' }],
      id: '',
      provider: '',
      displayName: '',
    };

    getTokenHandleFn('google', profile, mockDone);

    expect(mockDone.mock.results[0].value.err).toEqual(
      new Error('profile ID could not be retrieved.'),
    );
  });

  it('should return the profile data', () => {
    const email = 'email';
    const id = '1';
    const strategy = 'google';

    const profile: Profile = {
      emails: [{ value: email }],
      id,
      provider: '',
      displayName: '',
    };

    getTokenHandleFn(strategy, profile, mockDone);

    expect(mockDone.mock.results[0].value).toEqual({ email, id, strategy });
  });
});
