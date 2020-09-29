import {
  Express, Request, Response, NextFunction,
} from 'express-serve-static-core';
import { StatusError } from '../utils/errors';
import { LoaderParams } from './loaders.type';
import routes from '../routes';
import { handleError } from '../utils/errors/handleError';

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
    const handledError = await handleError({ err });
    return res.status(handledError.status).json({ error: handledError.message });
  });
};

const expressLoader = ({ app, config }: LoaderParams): void => {
  handleHealthChecks(app);
  app.use(config.api.prefix, routes);

  handle404Routes(app);
  handleErrors(app);
};

export default expressLoader;
