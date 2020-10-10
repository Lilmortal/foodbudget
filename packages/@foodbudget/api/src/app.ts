import express from 'express';
import logger from '@foodbudget/logger';
import server from './apolloServer';
import config from './config';
import loaders from './loaders';

const app = express();

server.applyMiddleware({ app, path: config.api.prefix });

loaders({ app });

app.listen(config.api.port, () => logger.info(`App is now running at port ${config.api.port}`));
