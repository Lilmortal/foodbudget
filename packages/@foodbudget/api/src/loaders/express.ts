import { Application } from 'express';
import cookieParser from 'cookie-parser';
import { LoaderParams } from './loaders.type';

const handleHealthChecks = (app: Application) => {
  app.get('/healthcheck', (_req, res) => {
    res.status(200).send('Application is working perfectly!');
  });
};

const expressLoader = ({ app }: LoaderParams): void => {
  app.use(cookieParser());
  handleHealthChecks(app);
};

export default expressLoader;
