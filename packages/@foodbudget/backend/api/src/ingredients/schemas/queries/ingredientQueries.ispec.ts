import { PrismaClient } from '@prisma/client';
import { gql } from 'apollo-server-express';
import findUp from 'find-up';
import { createTestApolloServer, createTestDatabase, tearDownTestDatabase } from '../../../utils/test';

describe('ingredient queries', () => {
  let prismaClient: PrismaClient;

  beforeEach(async () => {
    const nodeModulesPath = await findUp('node_modules', { type: 'directory' });

    if (!nodeModulesPath) {
      throw new Error('could not find the closest node_modules.');
    }

    prismaClient = createTestDatabase(nodeModulesPath);
  });

  afterEach(async () => {
    await tearDownTestDatabase(prismaClient);
  });

  it('should get a list of ingredients', async () => {
    const { query, mutate } = createTestApolloServer(prismaClient);

    await mutate({
      mutation: gql`
        mutation ingredients($name: String!, $currency: Currency!, $amount: Float!) {
          ingredients(name: $name, currency: $currency, amount: $amount) {
            name
          }
        }
      `,
      variables: { name: 'pork', currency: 'NZD', amount: 40.2 },
    });

    const ingredientsRes = await query({
      query: gql`
        query ingredientsByName($name: String!) {
          ingredientsByName(name: $name) {
            name
          }
        }
      `,
      variables: { name: 'pork' },
    });

    expect(ingredientsRes.data?.ingredientsByName[0].name).toEqual('pork');
  });
});
