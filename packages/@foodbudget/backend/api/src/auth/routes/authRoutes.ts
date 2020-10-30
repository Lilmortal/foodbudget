import passport from 'passport';
import { Application, Request, Response } from 'express';

import AuthServices from '../services/AuthServices';

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
};

export default authRoutes;
