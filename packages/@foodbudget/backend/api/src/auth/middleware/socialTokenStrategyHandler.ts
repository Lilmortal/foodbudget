import passport, { Profile } from 'passport';

import {
  Strategy as GoogleTokenStrategy,
  VerifyCallback,
} from 'passport-google-oauth20';
import { Strategy as FacebookStrategy } from 'passport-facebook';
import logger from '@foodbudget/logger';

import { AppError } from '@foodbudget/errors';
import { NextFunction, Request, Response } from 'express';
import { Strategy } from '../routes';
import { SocialConfig } from '../../config';

const isProfileValid = (
  profile: Profile,
): profile is Profile & Pick<Required<Profile>, 'emails'> => {
  if (
    !profile.emails ||
    !Array.isArray(profile.emails) ||
    !profile.emails[0].value
  ) {
    throw new AppError({
      message: 'emails could not be retrieved.',
      isOperational: true,
    });
  }

  if (profile.emails.length > 1) {
    throw new AppError({
      message: 'multiple emails found.',
      isOperational: true,
    });
  }

  if (!profile.id) {
    throw new AppError({
      message: 'profile ID could not be retrieved.',
      isOperational: true,
    });
  }

  return true;
};

export const handleTokenStrategy = (strategy: Strategy) => async (
  accessToken: string,
  refreshToken: string,
  profile: Profile,
  done: VerifyCallback,
): Promise<void> => {
  try {
    if (isProfileValid(profile)) {
      const email = profile.emails[0].value;
      const { id } = profile;

      done(undefined, { email, id, strategy });
    }
  } catch (err) {
    logger.error(err.message);
    done(err, {});
  }
};

export interface AuthLoaderParams {
  googleConfig: SocialConfig;
  facebookConfig: SocialConfig;
}

export const socialTokenStrategyHandler = ({
  googleConfig,
  facebookConfig,
}: AuthLoaderParams) => (
  req: Request,
  res: Response,
  next: NextFunction,
): void => {
  // TODO
  passport.serializeUser((user, done) => {
    done(null, user);
  });

  passport.deserializeUser((user, done) => {
    done(null, user);
  });

  passport.use(
    new GoogleTokenStrategy(
      {
        clientID: googleConfig.clientId,
        clientSecret: googleConfig.clientSecret,
        callbackURL: 'http://localhost:8080/v1/auth/google/verify',
      },
      handleTokenStrategy('google'),
    ),
  );

  passport.use(
    new FacebookStrategy(
      {
        clientID: facebookConfig.clientId,
        clientSecret: facebookConfig.clientSecret,
        callbackURL: 'http://localhost:8080/v1/auth/facebook/verify',
        profileFields: ['id', 'email'],
      },
      handleTokenStrategy('facebook'),
    ),
  );

  next();
};
