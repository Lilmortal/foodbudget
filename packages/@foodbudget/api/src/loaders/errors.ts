import {
  Application, Request, Response, NextFunction,
} from 'express';
import logger from '@foodbudget/logger';
import { LoaderParams } from './loaders.type';
import { StatusError } from '../shared/errors';

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

const errorLoader = ({ app }: LoaderParams): void => {
  handle404Routes(app);
  handleErrors(app);
};

export default errorLoader;
