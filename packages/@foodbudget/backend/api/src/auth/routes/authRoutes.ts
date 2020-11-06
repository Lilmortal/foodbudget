import passport from 'passport';
import express, { Request, Response, Router } from 'express';

import { AppError } from '@foodbudget/errors';
import { AuthServices, TokenServices } from '../services';
import { EnvConfig } from '../../config';

const router = express.Router();

export type Strategy = 'google' | 'facebook';

const getSocialLoginRequest = (strategy: Strategy, id: string, email: string) => {
  if (strategy === 'google') {
    return {
      googleId: id,
      email,
    };
  }

  if (strategy === 'facebook') {
    return {
      facebookId: id,
      email,
    };
  }

  throw new AppError({ message: 'not a valid strategy.', isOperational: true });
};

interface SocialLoginData {
  email: string;
  id: string;
  strategy: Strategy
}

const isSocialLoginData = (user: Express.User): user is SocialLoginData => !!(user as SocialLoginData).email
&& !!(user as SocialLoginData).id && !!(user as SocialLoginData).strategy;

export const handleTokenVerification = (
  tokenServices: Required<TokenServices>, authServices: Required<AuthServices>, env: EnvConfig,
) => async (
  req: Request, res: Response,
): Promise<void> => {
  if (req.user && isSocialLoginData(req.user)) {
    await authServices.login(getSocialLoginRequest(req.user.strategy, req.user.id, req.user.email));

    const refreshToken = tokenServices.createRefreshToken(req.user.id, env);

    res.cookie(refreshToken.name, refreshToken.value, refreshToken.options);
    // res.redirect('http://localhost:8080/graphql');
  } else {
    // res.redirect('http://locahost:8080/login?failureMessage=User ID is not found.');
  }
};

export interface AuthRoutesInjection {
  tokenServices: Required<TokenServices>;
  authServices: Required<AuthServices>;
  env: EnvConfig;
}

export const authRoutes = ({ tokenServices, authServices, env }: AuthRoutesInjection): Router => {
  router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));
  router.get('/google/verify', passport.authenticate('google',
    { failureRedirect: 'http://localhost:8080/login?fail=true' }),
  handleTokenVerification(tokenServices, authServices, env));

  router.get('/facebook', passport.authenticate('facebook', { scope: ['email'] }));
  router.get('/facebook/verify', passport.authenticate('facebook',
    { failureRedirect: 'http://localhost:8080/login?fail=true' }),
  handleTokenVerification(tokenServices, authServices, env));

  return router;
};
