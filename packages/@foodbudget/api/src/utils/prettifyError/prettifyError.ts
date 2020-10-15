import { ApolloError } from 'apollo-server-express';
import { printError } from 'graphql';

const prettifyStackTrace = (stackTraces: string[]) => {
  // Remove the error message as we already printed it out.
  stackTraces.shift();
  return stackTraces.join('\n');
};

const isPrismaError = (stackTraces: string[]) => stackTraces[1]?.startsWith('\x1B[31mInvalid \x1B[1m');

const prettifyError = (err: Error): string => {
  const errorMessages = [];
  if (err instanceof ApolloError) {
    errorMessages.push(printError(err));

    const stackTraces = err.extensions?.exception?.stacktrace as string[];

    // Prisma prints its own stack trace.
    if (!isPrismaError(stackTraces)) {
      errorMessages.push(prettifyStackTrace(stackTraces));
    }

    return errorMessages.join('\n');
  }

  return err.message;
};

export default prettifyError;