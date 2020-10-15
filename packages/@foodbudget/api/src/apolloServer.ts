import { ApolloServer } from 'apollo-server-express';
import logger from '@foodbudget/logger';
import schema from './schema';
import context from './context';

import prettifyError from './utils/prettifyError';

const server = new ApolloServer({
  schema,
  context,
  formatError: (err) => {
    logger.error(prettifyError(err));
    return err;
  },
});

export default server;
