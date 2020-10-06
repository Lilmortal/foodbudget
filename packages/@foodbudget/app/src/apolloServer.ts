import { ApolloServer } from 'apollo-server-express';
import schema from './schema';
import serviceManager from './serviceManager';

const server = new ApolloServer({ schema, context: () => ({ serviceManager }) });

export default server;
