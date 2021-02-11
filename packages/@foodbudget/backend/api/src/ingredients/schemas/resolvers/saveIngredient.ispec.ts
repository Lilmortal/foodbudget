import { PrismaClient } from '@prisma/client';
import { gql } from 'apollo-server-express';
import findUp from 'find-up';
import {
  createTestApolloServer,
  createTestDatabase,
  tearDownTestDatabase,
} from '../../../utils/test';

describe('save ingredient', () => {
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

  it('should save ingredients', async () => {
    const { mutate } = createTestApolloServer(prismaClient);

    const savedIngredientRes = await mutate({
      mutation: gql`
        mutation ingredients(
          $name: String!
          $currency: Currency!
          $amount: Float!
        ) {
          ingredients(name: $name, currency: $currency, amount: $amount) {
            name
            price {
              currency
              amount
            }
          }
        }
      `,
      variables: { name: 'pork', currency: 'NZD', amount: 40.2 },
    });

    expect(savedIngredientRes.data?.ingredients.name).toEqual('pork');
    expect(savedIngredientRes.data?.ingredients.price.currency).toEqual('NZD');
    expect(savedIngredientRes.data?.ingredients.price.amount).toEqual(40.2);
  });

  it('should update an existing ingredient', async () => {
    const { mutate } = createTestApolloServer(prismaClient);

    await mutate({
      mutation: gql`
        mutation ingredients(
          $name: String!
          $currency: Currency!
          $amount: Float!
        ) {
          ingredients(name: $name, currency: $currency, amount: $amount) {
            name
            price {
              currency
              amount
            }
          }
        }
      `,
      variables: { name: 'pork', currency: 'NZD', amount: 40.2 },
    });

    const updatedIngredientRes = await mutate({
      mutation: gql`
        mutation ingredients(
          $name: String!
          $currency: Currency!
          $amount: Float!
        ) {
          ingredients(name: $name, currency: $currency, amount: $amount) {
            name
            price {
              currency
              amount
            }
          }
        }
      `,
      variables: { name: 'pork', currency: 'AUD', amount: 30.2 },
    });

    expect(updatedIngredientRes.data?.ingredients.name).toEqual('pork');
    expect(updatedIngredientRes.data?.ingredients.price.currency).toEqual(
      'AUD',
    );
    expect(updatedIngredientRes.data?.ingredients.price.amount).toEqual(30.2);
  });
});
