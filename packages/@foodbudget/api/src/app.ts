import express, {
  Application, Request, Response, NextFunction,
} from 'express';
import logger from '@foodbudget/logger';
import cookieParser from 'cookie-parser';
import server from './apolloServer';
import config from './config';
import serviceManager from './serviceManager';
import { StatusError } from './shared/errors';
import handleAuth from './auth';

const handleHealthChecks = (app: Application) => {
  app.get('/healthcheck', (_req, res) => {
    res.status(200).send('Application is working perfectly!');
  });
};

const handle404Routes = (app: Application) => {
  app.use(() => {
    throw new StatusError(404, 'Page not found');
  });
};

const handleErrors = (app: Application) => {
  const isStatusError = (err: unknown): err is StatusError => (err as StatusError).status !== undefined;

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  app.use(async (err: unknown, _req: Request, res: Response, _next: NextFunction) => {
    if (isStatusError(err)) {
      logger.error(err.stack || err.message);
      return res.status(err.status).json({ error: err.message });
    }

    return res.status(500).json({ error: err });
  });
};

const app = express();

server.applyMiddleware({ app, path: config.api.prefix });

app.use(cookieParser());

handleHealthChecks(app);
handleAuth(app, config, serviceManager.userServices);
handle404Routes(app);
handleErrors(app);

app.listen(config.api.port, () => logger.info(`App is now running at port ${config.api.port}`));
