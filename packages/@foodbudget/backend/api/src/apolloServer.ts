import {
  ApolloError, ApolloServer, ValidationError,
} from 'apollo-server-express';
import logger from '@foodbudget/logger';
import { GraphQLError, printError } from 'graphql';
import { AppError } from '@foodbudget/errors';
import queryComplexity, { simpleEstimator } from 'graphql-query-complexity';
import colors from 'colors/safe';
import schema from './schema';
import context from './context';
import config from './config';
import 'apollo-cache-control';

const prettifyStackTrace = (stackTraces: string[]) => {
  // Remove the error message as we already printed it out.
  stackTraces.shift();
  return stackTraces.join('\n');
};

const isPrismaError = (stackTraces: string[]) => stackTraces[1]?.startsWith('\x1B[31mInvalid \x1B[1m');

const prettifyError = (err: Error): string => {
  const errorMessages = [];
  if (err instanceof GraphQLError || err instanceof ApolloError || err instanceof ValidationError) {
    errorMessages.push(printError(err));

    const stackTraces = err.extensions?.exception?.stacktrace as string[];

    // Prisma prints its own stack trace.
    if (stackTraces && !isPrismaError(stackTraces)) {
      errorMessages.push(prettifyStackTrace(stackTraces));
    }
    return errorMessages.join('\n');
  }

  return err.message;
};

const removeStackTraceOnProd = (err: Error) => {
  if (config.env === 'production') {
    if ((err instanceof GraphQLError || err instanceof ApolloError) && err.extensions?.exception?.stacktrace) {
      // eslint-disable-next-line no-param-reassign
      delete err.extensions.exception;
    }

    // eslint-disable-next-line no-param-reassign
    delete err.stack;
  }
};

const server = new ApolloServer({
  schema,
  context,
  debug: true,
  validationRules: [
    queryComplexity({
      estimators: [
        simpleEstimator({ defaultComplexity: 1 }),
      ],
      maximumComplexity: 100,
      onComplete: (complexity: number) => {
        if (complexity > 0) {
          logger.info(colors.yellow(`Query Complexity: ${complexity}`));
        }
      },
    }),
  ],
  introspection: config.env === 'development',
  formatError: (err: GraphQLError) => {
    const { sessionId } = logger.defaultMeta;
    logger.error(prettifyError(err));

    removeStackTraceOnProd(err);

    if (err instanceof ValidationError || err instanceof AppError) {
      return err;
    }

    return new GraphQLError(`Internal server error: ${sessionId}`);
  },
  cacheControl: true,
});

export default server;
