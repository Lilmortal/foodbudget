import passport from 'passport';

import { Request, Response } from 'express';
import ms from 'ms';

import logger from '@foodbudget/logger';
import { LoaderParams } from '../loaders.type';
import {
  createAccessToken, getDecodedRefreshToken, isRefreshTokenValid, renewRefreshToken,
} from '../../shared/tokens';

const handleTokenVerification = (req: Request, res: Response) => {
  if (req.user && isRefreshTokenValid(req.user)) {
    renewRefreshToken(req.user.userId, res);
    res.redirect('http://localhost:8080/graphql');
  } else {
    res.redirect('http://locahost:8080/login?failureMessage=User ID is not found.');
  }
};

const authRoutes = ({ app, config } : LoaderParams): void => {
  app.get('/v1/auth/google', passport.authenticate('google', { scope: ['profile', 'email'] }));
  app.get('/v1/auth/google/verify', passport.authenticate('google',
    { failureRedirect: 'http://localhost:8080/login?fail=true' }), handleTokenVerification);

  app.get('/v1/auth/facebook', passport.authenticate('facebook', { scope: ['email'] }));
  app.get('/v1/auth/facebook/verify', passport.authenticate('facebook',
    { failureRedirect: 'http://localhost:8080/login?fail=true' }), handleTokenVerification);

  app.get('/refresh-token', (req: Request, res: Response) => {
    try {
      const decodedRefreshToken = getDecodedRefreshToken(req);
      const accessToken = createAccessToken(decodedRefreshToken.userId, config);
      const expiryTime = new Date(Date.now() + ms(config.token.access.expireTime));

      renewRefreshToken(decodedRefreshToken.userId, res);

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
