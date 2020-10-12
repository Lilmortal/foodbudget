import passport, { Profile } from 'passport';

import { Strategy as GoogleTokenStrategy, VerifyCallback } from 'passport-google-oauth20';
import { Request, Response } from 'express';
import { LoaderParams } from './loaders.type';
import config from '../config';
import { ServiceManager } from '../serviceManager';

// TODO: Fix Prettier not working properly in this line.
// eslint-disable-next-line max-len
const googleTokenStrategyCallback = (serviceManager: ServiceManager) => async (accessToken: string, refreshToken: string, profile: Profile, done: VerifyCallback) => {
  let error: Error | undefined;
  if (!profile.emails) {
    error = new Error('google emails could not be retrieved.');
  } else if (profile.emails.length > 1) {
    error = new Error('multiple google emails found.');
  } else {
    const email = profile.emails[0].value;

    try {
      await serviceManager.userServices.login(email);
    } catch (err) {
      error = err;
    }
  }

  console.log(error);

  done(undefined, error ? false : {
    accessToken,
    refreshToken,
    profile,
  }, { message: error?.message });
};

passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser((user, done) => {
  done(null, user);
});

const init = ({ app, serviceManager } : LoaderParams): void => {
  passport.use(new GoogleTokenStrategy({
    clientID: config.google.clientId,
    clientSecret: config.google.clientSecret,
    callbackURL: 'http://localhost:8080/v1/auth/google/verify',
  }, googleTokenStrategyCallback(serviceManager)));

  app.use(passport.initialize());

  // TODO: Create a JWT, store the email inside, expiry time, send it as a response.
  // Create a refresh token, set it as httpOnly same-site cookie.
  // When client calls GraphQL, pass JWT in HTTP header
  // client starts countdown, calling /refresh-token before JWT expired, verify refresh token is valid
  // creates a new refresh token and pass it in
  // if user refresh page, call /refresh-token
  app.get('/v1/auth/google', passport.authenticate('google', { scope: ['profile', 'email'] }));
  app.get('/v1/auth/google/verify', (_req: Request, res: Response) => {
    res.cookie('refresh token', { httpOnly: true, maxAge: 90000 });
    return passport.authenticate('google',
      { successRedirect: 'http://localhost:8080/graphql', failureRedirect: 'http://localhost:8080/graphql' });
  });

  // app.get('/refresh-token', )
};

export default init;
