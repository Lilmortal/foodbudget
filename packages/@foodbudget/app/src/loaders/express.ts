import {
  Express, Request, Response, NextFunction,
} from 'express-serve-static-core';
import { StatusError } from '@foodbudget/errors';
import { ApolloServer, gql } from 'apollo-server-express';
import { LoaderParams } from './loaders.type';
import routes from '../routes';
import { handleError } from '../utils/handleError';

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

const typeDefs = gql`
# This "Book" type defines the queryable fields for every book in our data source.
type Book {
  title: String
  author: String,
  hehe(num: Int!): String
}

# The "Query" type is special: it lists all of the available queries that
# clients can execute, along with the return type for each. In this
# case, the "books" query returns an array of zero or more Books (defined above).
type Query {
  books: [Book],
  test(num: Int!): String
}

type Mutation {
  addBook(title: String, author: String): Book
}`;

const books = [
  {
    title: 'The Awakening',
    author: 'Kate Chopin',
  },
  {
    title: 'City of Glass',
    author: 'Paul Auster',
  },
];

const resolvers = {
  Query: {
    books: () => books,
    test: () => 'lala',
  },
};

const server = new ApolloServer({ typeDefs, resolvers });

const expressLoader = ({ app, config, serviceManager }: LoaderParams): void => {
  handleHealthChecks(app);
  routes(serviceManager);
  server.applyMiddleware({ app, path: config.api.prefix });

  handle404Routes(app);
  handleErrors(app);
};

export default expressLoader;
