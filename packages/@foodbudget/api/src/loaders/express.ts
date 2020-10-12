import {
  Application, Request, Response, NextFunction,
} from 'express';
import logger from '@foodbudget/logger';
import cookieParser from 'cookie-parser';
import { LoaderParams } from './loaders.type';
import { StatusError } from '../shared/errors';

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
    console.log('express', err);
    if (isStatusError(err)) {
      logger.error(err.stack || err.message);
      return res.status(err.status).json({ error: err.message });
    }

    return res.status(500).json({ error: err });
  });
};

const expressLoader = ({ app }: LoaderParams): void => {
  app.use(cookieParser());
  handleHealthChecks(app);
  handle404Routes(app);
  handleErrors(app);
};

export default expressLoader;
