import {
  Express, Request, Response, NextFunction,
} from 'express-serve-static-core';
import { StatusError } from '@foodbudget/errors';
import { LoaderParams } from './loaders.type';
import handleError from '../utils/handleError';

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
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  app.use(async (err: unknown, _req: Request, res: Response, _next: NextFunction) => {
    const handledError = handleError(err);
    return res.status(handledError.status).json({ error: handledError.message });
  });
};

const expressLoader = ({ app }: LoaderParams): void => {
  handleHealthChecks(app);
  handle404Routes(app);
  handleErrors(app);
};

export default expressLoader;
