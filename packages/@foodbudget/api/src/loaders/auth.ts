import passport, { Profile } from 'passport';

import { Strategy as GoogleTokenStrategy, VerifyCallback } from 'passport-google-oauth20';
import { Request, Response } from 'express';
import { sign, verify } from 'jsonwebtoken';
import logger from '@foodbudget/logger';
import { LoaderParams } from './loaders.type';
import { ServiceManager } from '../serviceManager';

interface UserJWTPayload extends Express.User {
  userId: string | undefined;
}

const isUserJWTPayload = (token: unknown): token is UserJWTPayload => (token as UserJWTPayload).userId !== undefined;

const validateProfile = (profile: Profile): profile is Profile & Pick<Required<Profile>, 'emails'> => {
  if (!profile.emails || !profile.emails[0].value) {
    throw new Error('google emails could not be retrieved.');
  }

  if (profile.emails.length > 1) {
    throw new Error('multiple google emails found.');
  }

  if (!profile.id) {
    throw new Error('profile ID could not be retrieved.');
  }

  return true;
};

const googleTokenStrategyCallback = (
  serviceManager: ServiceManager,
) => async (accessToken: string, refreshToken: string, profile: Profile, done: VerifyCallback) => {
  try {
    if (validateProfile(profile)) {
      const email = profile.emails[0].value;
      const { id } = profile;

      let user = await serviceManager.userServices.login({ googleId: id });

      if (!user) {
        user = await serviceManager.userServices.register({ google_id: id, email });
      }

      const userJWTPayload: UserJWTPayload = {
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

interface Token {
  payload: UserJWTPayload;
  secret: string;
  expireTime: string;
}

const createNewToken = ({ payload, secret, expireTime }: Token) => {
  const token = sign(payload, secret, { expiresIn: expireTime });
  return token;
};

const init = ({ app, config, serviceManager } : LoaderParams): void => {
  passport.use(new GoogleTokenStrategy({
    clientID: config.google.clientId,
    clientSecret: config.google.clientSecret,
    callbackURL: 'http://localhost:8080/v1/auth/google/verify',
  }, googleTokenStrategyCallback(serviceManager)));

  app.use(passport.initialize());

  app.get('/v1/auth/google', passport.authenticate('google', { scope: ['profile', 'email'] }));
  app.get('/v1/auth/google/verify', passport.authenticate('google',
    { failureRedirect: 'http://localhost:8080/login?fail=true' }),
  (req: Request, res: Response) => {
    if (isUserJWTPayload(req.user) && req.user.userId) {
      const refreshToken = createNewToken({
        payload: { userId: req.user.userId },
        secret: config.token.refresh.secret,
        expireTime: config.token.refresh.expireTime,
      });

      res.cookie('refresh-token', refreshToken, { httpOnly: true });
      res.redirect('http://localhost:8080/graphql');
    }

    res.redirect('http://locahost:8080/login?failureMessage=User ID is not found.');
  });

  app.get('/refresh-token', (req: Request, res: Response) => {
    const refreshToken = req.cookies['refresh-token'];
    if (!refreshToken) {
      res.redirect('http://localhost:8080/login');
    }

    const decodedRefreshToken = verify(refreshToken, 'secretKey');
    if (isUserJWTPayload(decodedRefreshToken) && decodedRefreshToken.userId) {
      const accessToken = createNewToken({
        payload: { userId: decodedRefreshToken.userId },
        secret: config.token.access.secret,
        expireTime: config.token.access.expireTime,
      });

      // TODO
      // 15 minutes
      const expiryTime = new Date(Date.now() + 900000);

      const newRefreshToken = createNewToken({
        payload: { userId: decodedRefreshToken.userId },
        secret: config.token.refresh.secret,
        expireTime: config.token.refresh.expireTime,
      });

      res.cookie('refresh-token', newRefreshToken, { httpOnly: true });

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
