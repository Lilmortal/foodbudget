import { ApolloServer, ApolloServerExpressConfig } from 'apollo-server-express';
import {
  ApolloServerTestClient,
  createTestClient,
} from 'apollo-server-testing';
import { PrismaClient } from '@prisma/client';
import { schema } from '../../schema';
import { mockServiceManager, serviceManager } from '../../serviceManager';
import { config } from '../../config';
import { Context } from '../../context';

export const createTestApolloServer = (
  prismaClient?: PrismaClient,
  apolloConfig?: Partial<ApolloServerExpressConfig>,
): ApolloServerTestClient => {
  let server: ApolloServer;

  const testServiceManager = prismaClient
    ? mockServiceManager(prismaClient)
    : serviceManager;

  if (apolloConfig) {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { context, ...configWithoutContext } = apolloConfig;

    server = new ApolloServer({
      schema,
      context: {
        serviceManager: {
          ...testServiceManager,
          ...(apolloConfig?.context as Context)?.serviceManager,
        },
        config,
        ...apolloConfig?.context,
      },
      ...configWithoutContext,
    });
  }

  server = new ApolloServer({
    schema,
    context: {
      serviceManager: {
        ...testServiceManager,
        ...(apolloConfig?.context as Context)?.serviceManager,
      },
      config,
      ...apolloConfig?.context,
    },
  });

  return {
    ...createTestClient(server),
  };
};
