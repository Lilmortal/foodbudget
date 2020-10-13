import passport, { Profile } from 'passport';

import { Strategy as GoogleTokenStrategy, VerifyCallback } from 'passport-google-oauth20';
import { Request, Response } from 'express';
import { sign, verify } from 'jsonwebtoken';
import { LoaderParams } from './loaders.type';
import config from '../config';
import { ServiceManager } from '../serviceManager';

// eslint-disable-next-line max-len
const VALID_EMAIL_REGEX = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

interface SocialUser extends Express.User {
  userId: string | undefined;
}

const isSocialUser = (token: unknown): token is SocialUser => (token as SocialUser).userId !== undefined;

// TODO: Fix Prettier not working properly in this line.
// eslint-disable-next-line max-len
const googleTokenStrategyCallback = (serviceManager: ServiceManager) => async (accessToken: string, refreshToken: string, profile: Profile, done: VerifyCallback) => {
  let error: Error | undefined;
  let userId: string | undefined;

  if (!profile.emails) {
    error = new Error('google emails could not be retrieved.');
  } else if (profile.emails.length > 1) {
    error = new Error('multiple google emails found.');
  } else {
    const email = profile.emails[0].value;

    if (!VALID_EMAIL_REGEX.test(email)) {
      error = new Error('Email is not valid.');
    }

    try {
      let user = await serviceManager.userServices.login(email);

      if (!user) {
        user = await serviceManager.userServices.register(email);
      }

      userId = user.id.toString();
    } catch (err) {
      error = err;
    }
  }

  const user: SocialUser = {
    userId,
  };
  done(error, user);
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
  // Create a refresh token, set it as httpOnly cookie.
  // When client calls GraphQL, pass JWT in HTTP header
  // client starts countdown, calling /refresh-token before JWT expired, verify refresh token is valid
  // creates a new refresh token and pass it in
  // if user refresh page, call /refresh-token
  app.get('/v1/auth/google', passport.authenticate('google', { scope: ['profile', 'email'] }));
  app.get('/v1/auth/google/verify', passport.authenticate('google',
    { failureRedirect: 'http://localhost:8080/login?fail=true' }),
  (req: Request, res: Response) => {
    if (isSocialUser(req.user) && req.user.userId) {
      const refreshToken = sign({ userId: req.user.userId }, 'secretKey', { expiresIn: '7d' });

      res.cookie('refresh-token', refreshToken, { httpOnly: true });
      res.redirect('http://localhost:8080/graphql');
    }

    res.status(500).send('User ID is not found.');
  });

  app.get('/refresh-token', (req: Request, res: Response) => {
    // Get refresh token
    // If it does not exist, redirect to login page
    // If it exists, get userId from it
    // if userId exist, create accessToken and expiryTime, return the response
    // create new refresh token and pass it
    const refreshToken = req.cookies['refresh-token'];
    if (!refreshToken) {
      res.redirect('http://localhost:8080/login');
    }

    const decodedRefreshToken = verify(refreshToken, 'secretKey');
    if (typeof decodedRefreshToken === 'object' && isSocialUser(decodedRefreshToken) && decodedRefreshToken.userId) {
      const accessToken = sign({ userId: decodedRefreshToken.userId }, 'accessKey', { expiresIn: '15m' });
      // 15 minutes
      const expiryTime = new Date(Date.now() + 900000);

      // create new refresh token

      res.status(200).send({
        accessToken,
        expiryTime,
      });
    } else {
      res.redirect('http://localhost:8080/login');
    }
  });
};

export default init;
