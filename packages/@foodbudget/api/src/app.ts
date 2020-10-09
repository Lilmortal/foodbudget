import express from 'express';
import server from './apolloServer';
import config from './config';
import loaders from './loaders';
import logger from './logger';

const app = express();

server.applyMiddleware({ app, path: config.api.prefix });

loaders({ app });

app.listen(config.api.port, () => logger.info(`App is now running at port ${config.api.port}`));
