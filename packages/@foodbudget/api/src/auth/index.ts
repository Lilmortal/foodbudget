import { Application } from 'express';
import { SocialConfig } from '../config';
import UserServices from '../users/services';
import handleSocialAuth from './social';
import authRoutes from './routes/authRoutes';
import AuthServices from './services/AuthServices';

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
  handleSocialAuth({
    app, googleConfig, facebookConfig, userServices,
  });
  authRoutes({ app, authServices });
};

export { default as AuthServices } from './services/AuthServices';

export default auth;
