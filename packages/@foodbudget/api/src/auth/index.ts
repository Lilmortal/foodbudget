import { Application } from 'express';
import { SocialConfig } from '../config';
import UserServices from '../users/services';
import authLoader from './authLoader';
import authRoutes from './authRoutes';
import AuthServices from './AuthServices';

export interface AuthParams {
  app: Application;
  googleConfig: SocialConfig;
  facebookConfig: SocialConfig;
  userServices: Required<UserServices>;
   authServices: Required<AuthServices>;
}

const auth = ({
  app, googleConfig, facebookConfig, userServices, authServices,
}: AuthParams): void => {
  authLoader({
    app, googleConfig, facebookConfig, userServices,
  });
  authRoutes({ app, authServices });
};

export { default as AuthServices } from './AuthServices';
export default auth;
