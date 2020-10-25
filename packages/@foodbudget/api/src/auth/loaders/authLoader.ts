import passport, { Profile } from 'passport';

import { Strategy as GoogleTokenStrategy, VerifyCallback } from 'passport-google-oauth20';
import { Strategy as FacebookStrategy } from 'passport-facebook';

import logger from '@foodbudget/logger';
import { Application } from 'express';

import UserServices, { LoginRequest } from '../../users/services';
import { RefreshTokenPayload } from '../Auth.types';
import { SocialConfig } from '../../config';

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
  userServices: Required<UserServices>,
  strategy: Strategy,
) => async (accessToken: string, refreshToken: string, profile: Profile, done: VerifyCallback) => {
  try {
    if (validateProfile(profile)) {
      const email = profile.emails[0].value;
      const { id } = profile;

      const socialLoginRequest = getSocialLoginRequest(strategy, id);

      let user = await userServices.login({ ...socialLoginRequest });

      if (!user) {
        user = await userServices.register({ ...socialLoginRequest, email });

        if (!user) {
          throw new Error(`Attempting to register ${email} failed.`);
        }
      }

      const refreshTokenPayload: Pick<RefreshTokenPayload, 'userId'> = {
        userId: user.id.toString(),
      };
      done(undefined, refreshTokenPayload);
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

export interface AuthLoaderParams {
  app: Application;
  googleConfig: SocialConfig;
  facebookConfig: SocialConfig;
  userServices: Required<UserServices>;
}

const authLoader = ({
  app, googleConfig, facebookConfig, userServices,
}: AuthLoaderParams): void => {
  passport.use(new GoogleTokenStrategy({
    clientID: googleConfig.clientId,
    clientSecret: googleConfig.clientSecret,
    callbackURL: 'http://localhost:8080/v1/auth/google/verify',
  }, handleTokenStrategy(userServices, 'google')));

  passport.use(new FacebookStrategy({
    clientID: facebookConfig.clientId,
    clientSecret: facebookConfig.clientSecret,
    callbackURL: 'http://localhost:8080/v1/auth/facebook/verify',
    profileFields: ['id', 'email'],
  }, handleTokenStrategy(userServices, 'facebook')));

  app.use(passport.initialize());
};

export default authLoader;
