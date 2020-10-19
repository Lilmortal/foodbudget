import { Application } from 'express';
import { Config } from '../config';
import UserServices from '../users/services';
import authLoader from './authLoader';
import authRoutes from './authRoutes';

const handleAuth = (app: Application, config: Config, userService: Required<UserServices>): void => {
  authLoader(app, config, userService);
  authRoutes(app, config);
};

export default handleAuth;
