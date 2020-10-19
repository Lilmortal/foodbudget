import passport from 'passport';

import { Application, Request, Response } from 'express';
import ms from 'ms';

import logger from '@foodbudget/logger';

import { Config } from '../config';
import {
  createAuthAccessToken, getDecodedRefreshToken, isAuthRefreshToken, renewAuthRefreshToken,
} from '../shared/tokens';
import getAuthRefreshTokenKey from '../shared/tokens/getAuthRefreshTokenKey';

const handleTokenVerification = (config: Config) => (req: Request, res: Response) => {
  if (req.user && isAuthRefreshToken(req.user)) {
    const refreshToken = renewAuthRefreshToken(
      req.user.userId, config.token.refresh.secret, config.token.refresh.expireTime,
    );
    res.cookie(refreshToken.key, refreshToken.value, { httpOnly: true });
    res.redirect('http://localhost:8080/graphql');
  } else {
    res.redirect('http://locahost:8080/login?failureMessage=User ID is not found.');
  }
};

const authRoutes = (app: Application, config: Config): void => {
  app.get('/v1/auth/google', passport.authenticate('google', { scope: ['profile', 'email'] }));
  app.get('/v1/auth/google/verify', passport.authenticate('google',
    { failureRedirect: 'http://localhost:8080/login?fail=true' }), handleTokenVerification(config));

  app.get('/v1/auth/facebook', passport.authenticate('facebook', { scope: ['email'] }));
  app.get('/v1/auth/facebook/verify', passport.authenticate('facebook',
    { failureRedirect: 'http://localhost:8080/login?fail=true' }), handleTokenVerification(config));

  app.get('/v1/refresh-token', (req: Request, res: Response) => {
    try {
      const refreshTokenKey = getAuthRefreshTokenKey();
      const refreshToken = req.cookies[refreshTokenKey];
      const decodedRefreshToken = getDecodedRefreshToken(refreshToken, config.token.refresh.secret);

      if (!isAuthRefreshToken(decodedRefreshToken)) {
        throw new Error('invalid refresh token.');
      }

      const accessToken = createAuthAccessToken(decodedRefreshToken.userId, config);
      const expiryTime = new Date(Date.now() + ms(config.token.access.expireTime));

      const renewedRefreshToken = renewAuthRefreshToken(
        decodedRefreshToken.userId, config.token.refresh.secret, config.token.refresh.expireTime,
      );
      res.cookie(renewedRefreshToken.key, renewedRefreshToken.value, { httpOnly: true });

      res.status(200).send({
        accessToken,
        expiryTime,
      });
    } catch (err) {
      logger.error(err.message);
      res.redirect('http://localhost:8080/login');
    }
  });
};

export default authRoutes;
