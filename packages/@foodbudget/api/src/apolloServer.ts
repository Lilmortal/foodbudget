import { ApolloServer } from 'apollo-server-express';
import logger from '@foodbudget/logger';
import schema from './schema';
import serviceManager from './serviceManager';
import prettifyError from './utils/prettifyError';

const server = new ApolloServer({
  schema,
  context: () => ({ serviceManager }),
  formatError: (err) => {
    logger.error(prettifyError(err));
    return err;
  },
});

export default server;
