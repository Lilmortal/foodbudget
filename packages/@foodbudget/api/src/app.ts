import express, {
  Application, Request, Response, NextFunction,
} from 'express';
import logger from '@foodbudget/logger';
import cookieParser from 'cookie-parser';
import { AppError, ErrorHandler } from '@foodbudget/errors';
import server from './apolloServer';
import config from './config';
import serviceManager from './serviceManager';
import handleAuth from './auth';

const handleHealthChecks = (app: Application) => {
  app.get('/healthcheck', (_req, res) => {
    res.status(200).send('Application is working perfectly!');
  });
};

const handle404Routes = (app: Application) => {
  app.use(() => {
    throw new AppError({ message: 'Page not found', isOperational: true, httpStatus: 404 });
  });
};

const handleErrors = (app: Application) => {
  // eslint-disable-next-line consistent-return
  app.use(async (err: unknown, _req: Request, res: Response, next: NextFunction): Promise<Response | undefined> => {
    if (err instanceof AppError && ErrorHandler.isOperational(err)) {
      return res.status(err.httpStatus || 500).json({ error: err.message });
    }

    next(err);
  });
};

const app = express();

server.applyMiddleware({ app, path: config.api.prefix });

app.use(cookieParser());

handleHealthChecks(app);
handleAuth({
  app,
  googleConfig: config.google,
  facebookConfig: config.facebook,
  userServices: serviceManager.userServices,
  authServices: serviceManager.authServices,
});
handle404Routes(app);
handleErrors(app);

app.listen(config.api.port, () => logger.info(`App is now running at port ${config.api.port}`));
