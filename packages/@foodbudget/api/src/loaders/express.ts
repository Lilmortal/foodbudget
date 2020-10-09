import {
  Express, Request, Response, NextFunction,
} from 'express-serve-static-core';
import { StatusError } from '@foodbudget/errors';
import { LoaderParams } from './loaders.type';
import logger from '../logger';

const handleHealthChecks = (app: Express) => {
  app.get('/healthcheck', (_req, res) => {
    res.status(200).send('Application is working perfectly!');
  });
};

const handle404Routes = (app: Express) => {
  app.use(() => {
    throw new StatusError(404, 'Page not found');
  });
};

const handleErrors = (app: Express) => {
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

const expressLoader = ({ app }: LoaderParams): void => {
  handleHealthChecks(app);
  handle404Routes(app);
  handleErrors(app);
};

export default expressLoader;
