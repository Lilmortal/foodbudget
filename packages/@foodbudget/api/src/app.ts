import express from 'express';
import server from './apolloServer';
import config from './config';
import loaders from './loaders';
import logger from './logger';
import handleError from './utils/prettifyError';

const app = express();

try {
  server.applyMiddleware({ app, path: config.api.prefix });
} catch (err) {
  console.log('hhh');
  handleError(err);
}

loaders({ app });

app.listen(config.api.port, () => logger.info(`App is now running at port ${config.api.port}`));
