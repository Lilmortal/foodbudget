import passport, { Profile } from 'passport';

import { Strategy as GoogleTokenStrategy, VerifyCallback } from 'passport-google-oauth20';
import { Strategy as FacebookStrategy } from 'passport-facebook';

import logger from '@foodbudget/logger';
import { LoaderParams } from '../loaders.type';
import { ServiceManager } from '../../serviceManager';

import { LoginRequest } from '../../users/services';
import { RefreshToken } from '../../shared/tokens';

const validateProfile = (profile: Profile): profile is Profile & Pick<Required<Profile>, 'emails'> => {
  if (!profile.emails || !profile.emails[0].value) {
    throw new Error('emails could not be retrieved.');
  }

  if (profile.emails.length > 1) {
    throw new Error('multiple emails found.');
  }

  if (!profile.id) {
    throw new Error('profile ID could not be retrieved.');
  }

  return true;
};

type Strategy = 'google' | 'facebook';

const getSocialLoginRequest = (strategy: Strategy, id: string) => {
  let socialLoginRequest: LoginRequest = {
    email: '',
    password: '',
  };

  if (strategy === 'google') {
    socialLoginRequest = {
      googleId: id,
    };
  }

  if (strategy === 'facebook') {
    socialLoginRequest = {
      facebookId: id,
    };
  }

  return socialLoginRequest;
};

const handleTokenStrategy = (
  serviceManager: ServiceManager,
  strategy: Strategy,
) => async (accessToken: string, refreshToken: string, profile: Profile, done: VerifyCallback) => {
  try {
    if (validateProfile(profile)) {
      const email = profile.emails[0].value;
      const { id } = profile;

      const socialLoginRequest = getSocialLoginRequest(strategy, id);

      let user = await serviceManager.userServices.login({ ...socialLoginRequest });

      if (!user) {
        user = await serviceManager.userServices.register({ ...socialLoginRequest, email });

        if (!user) {
          throw new Error(`Attempting to register ${email} failed.`);
        }
      }

      const userJWTPayload: RefreshToken = {
        userId: user.id.toString(),
      };
      done(undefined, userJWTPayload);
    }
  } catch (err) {
    logger.error(err.message);
    done(err, {});
  }
};

// TODO
passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser((user, done) => {
  done(null, user);
});

const authLoader = ({ app, config, serviceManager } : LoaderParams): void => {
  passport.use(new GoogleTokenStrategy({
    clientID: config.google.clientId,
    clientSecret: config.google.clientSecret,
    callbackURL: 'http://localhost:8080/v1/auth/google/verify',
  }, handleTokenStrategy(serviceManager, 'google')));

  passport.use(new FacebookStrategy({
    clientID: config.facebook.clientId,
    clientSecret: config.facebook.clientSecret,
    callbackURL: 'http://localhost:8080/v1/auth/facebook/verify',
    profileFields: ['id', 'email'],
  }, handleTokenStrategy(serviceManager, 'facebook')));

  app.use(passport.initialize());
};

// @TODO: app.use, verify if access token is valid

export default authLoader;
