import passport from 'passport';
import { Application, Request, Response } from 'express';
import logger from '@foodbudget/logger';

import AuthServices from './AuthServices';

const handleTokenVerification = (authServices: Required<AuthServices>) => (req: Request, res: Response) => {
  if (req.user && authServices.isRefreshToken(req.user)) {
    const refreshToken = authServices.createRefreshToken(req.user.userId);
    res.cookie(refreshToken.name, refreshToken.value, { httpOnly: true });
    res.redirect('http://localhost:8080/graphql');
  } else {
    res.redirect('http://locahost:8080/login?failureMessage=User ID is not found.');
  }
};

export interface AuthRoutesParams {
  app: Application;
  authServices: Required<AuthServices>;
}

const authRoutes = ({ app, authServices }: AuthRoutesParams): void => {
  app.get('/v1/auth/google', passport.authenticate('google', { scope: ['profile', 'email'] }));
  app.get('/v1/auth/google/verify', passport.authenticate('google',
    { failureRedirect: 'http://localhost:8080/login?fail=true' }), handleTokenVerification(authServices));

  app.get('/v1/auth/facebook', passport.authenticate('facebook', { scope: ['email'] }));
  app.get('/v1/auth/facebook/verify', passport.authenticate('facebook',
    { failureRedirect: 'http://localhost:8080/login?fail=true' }), handleTokenVerification(authServices));

  app.get('/v1/refresh-token', (req: Request, res: Response) => {
    try {
      const refreshToken = req.cookies[authServices.refreshTokenKey];
      const decodedRefreshToken = authServices.decodeRefreshToken(refreshToken);
      const accessToken = authServices.createAccessToken(decodedRefreshToken.userId);
      const renewedRefreshToken = authServices.createRefreshToken(decodedRefreshToken.userId);

      res.cookie(renewedRefreshToken.name, renewedRefreshToken.value, renewedRefreshToken.options);

      res.status(200).send({
        accessToken,
      });
    } catch (err) {
      logger.error(err.message);
      res.redirect('http://localhost:8080/login');
    }
  });
};

export default authRoutes;
