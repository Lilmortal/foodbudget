import { PrismaClient } from '@prisma/client';
import { gql } from 'apollo-server-express';
import findUp from 'find-up';
import {
  createTestApolloServer,
  createTestDatabase,
  tearDownTestDatabase,
} from '../../../utils/test';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const createIngredient = async (
  mutate: (mutation: any) => Promise<any>,
  variables: object,
) => {
  await mutate({
    mutation: gql`
      mutation ingredients(
        $name: String!
        $currency: Currency!
        $amount: Float!
      ) {
        ingredients(name: $name, currency: $currency, amount: $amount) {
          name
        }
      }
    `,
    variables,
  });
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const queryIngredientsPagination = async (query: any, variables: object) => {
  const response = await query({
    query: gql`
      query ingredients($first: Int, $last: Int, $before: ID, $after: ID) {
        ingredients(
          first: $first
          last: $last
          before: $before
          after: $after
        ) {
          totalCount
          edges {
            cursor
            node {
              name
            }
          }
          pageInfo {
            startCursor
            hasPreviousPage
            hasNextPage
            endCursor
          }
        }
      }
    `,
    variables,
  });

  return response;
};

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

    await createIngredient(mutate, {
      name: 'pork',
      currency: 'NZD',
      amount: 40.2,
    });

    const response = await query({
      query: gql`
        query ingredientsByName($name: String!) {
          ingredientsByName(name: $name) {
            name
          }
        }
      `,
      variables: { name: 'pork' },
    });

    expect(response.data?.ingredientsByName[0].name).toEqual('pork');
  });

  describe('pagination', () => {
    describe('last ingredients', () => {
      it('should retrieve the next two ingredients without a cursor', async () => {
        const { query, mutate } = createTestApolloServer(prismaClient);

        await createIngredient(mutate, {
          name: 'ingredient1',
          currency: 'NZD',
          amount: 40.2,
        });
        await createIngredient(mutate, {
          name: 'ingredient2',
          currency: 'NZD',
          amount: 40.2,
        });
        await createIngredient(mutate, {
          name: 'ingredient3',
          currency: 'NZD',
          amount: 40.2,
        });

        const response = await queryIngredientsPagination(query, { last: 2 });

        expect(response.data?.ingredients).toEqual({
          edges: [
            {
              cursor: 'aW5ncmVkaWVudDE=',
              node: {
                name: 'ingredient1',
              },
            },
            {
              cursor: 'aW5ncmVkaWVudDI=',
              node: {
                name: 'ingredient2',
              },
            },
          ],
          pageInfo: {
            endCursor: 'aW5ncmVkaWVudDI=',
            hasNextPage: true,
            hasPreviousPage: false,
            startCursor: 'aW5ncmVkaWVudDE=',
          },
          totalCount: 2,
        });
      });

      it('should retrieve the next ingredient with a cursor', async () => {
        const { query, mutate } = createTestApolloServer(prismaClient);

        await createIngredient(mutate, {
          name: 'ingredient1',
          currency: 'NZD',
          amount: 40.2,
        });
        await createIngredient(mutate, {
          name: 'ingredient2',
          currency: 'NZD',
          amount: 40.2,
        });
        await createIngredient(mutate, {
          name: 'ingredient3',
          currency: 'NZD',
          amount: 40.2,
        });

        const response = await queryIngredientsPagination(query, {
          last: 1,
          after: 'aW5ncmVkaWVudDE=',
        });

        expect(response.data?.ingredients).toEqual({
          edges: [
            {
              cursor: 'aW5ncmVkaWVudDI=',
              node: {
                name: 'ingredient2',
              },
            },
          ],
          pageInfo: {
            endCursor: 'aW5ncmVkaWVudDI=',
            hasNextPage: true,
            hasPreviousPage: false,
            startCursor: 'aW5ncmVkaWVudDI=',
          },
          totalCount: 1,
        });
      });

      it('should retrieve all the ingredients to the end of the list given a large last value', async () => {
        const { query, mutate } = createTestApolloServer(prismaClient);

        await createIngredient(mutate, {
          name: 'ingredient1',
          currency: 'NZD',
          amount: 40.2,
        });
        await createIngredient(mutate, {
          name: 'ingredient2',
          currency: 'NZD',
          amount: 40.2,
        });
        await createIngredient(mutate, {
          name: 'ingredient3',
          currency: 'NZD',
          amount: 40.2,
        });

        const response = await queryIngredientsPagination(query, {
          last: 9999,
          after: 'aW5ncmVkaWVudDI=',
        });

        expect(response.data?.ingredients).toEqual({
          edges: [
            {
              cursor: 'aW5ncmVkaWVudDM=',
              node: {
                name: 'ingredient3',
              },
            },
          ],
          pageInfo: {
            endCursor: 'aW5ncmVkaWVudDM=',
            hasNextPage: false,
            hasPreviousPage: true,
            startCursor: 'aW5ncmVkaWVudDM=',
          },
          totalCount: 1,
        });
      });

      it('should not retrieve any ingredients if at the end of the list', async () => {
        const { query, mutate } = createTestApolloServer(prismaClient);

        await createIngredient(mutate, {
          name: 'ingredient1',
          currency: 'NZD',
          amount: 40.2,
        });
        await createIngredient(mutate, {
          name: 'ingredient2',
          currency: 'NZD',
          amount: 40.2,
        });

        const response = await queryIngredientsPagination(query, {
          last: 9999,
          after: 'aW5ncmVkaWVudDI=',
        });

        expect(response.data?.ingredients).toEqual({
          edges: [],
          pageInfo: {
            endCursor: null,
            hasNextPage: false,
            hasPreviousPage: true,
            startCursor: null,
          },
          totalCount: 0,
        });
      });
    });

    describe('first ingredients', () => {
      it('should return the last ingredient in the list without a cursor', async () => {
        const { query, mutate } = createTestApolloServer(prismaClient);

        await createIngredient(mutate, {
          name: 'ingredient1',
          currency: 'NZD',
          amount: 40.2,
        });
        await createIngredient(mutate, {
          name: 'ingredient2',
          currency: 'NZD',
          amount: 40.2,
        });
        await createIngredient(mutate, {
          name: 'ingredient3',
          currency: 'NZD',
          amount: 40.2,
        });

        const response = await queryIngredientsPagination(query, { first: 1 });

        expect(response.data?.ingredients).toEqual({
          edges: [
            {
              cursor: 'aW5ncmVkaWVudDM=',
              node: {
                name: 'ingredient3',
              },
            },
          ],
          pageInfo: {
            endCursor: 'aW5ncmVkaWVudDM=',
            hasNextPage: false,
            hasPreviousPage: true,
            startCursor: 'aW5ncmVkaWVudDM=',
          },
          totalCount: 1,
        });
      });

      it('should retrieve the previous ingredient with a cursor', async () => {
        const { query, mutate } = createTestApolloServer(prismaClient);

        await createIngredient(mutate, {
          name: 'ingredient1',
          currency: 'NZD',
          amount: 40.2,
        });
        await createIngredient(mutate, {
          name: 'ingredient2',
          currency: 'NZD',
          amount: 40.2,
        });
        await createIngredient(mutate, {
          name: 'ingredient3',
          currency: 'NZD',
          amount: 40.2,
        });

        const response = await queryIngredientsPagination(query, {
          first: 1,
          before: 'aW5ncmVkaWVudDM=',
        });

        expect(response.data?.ingredients).toEqual({
          edges: [
            {
              cursor: 'aW5ncmVkaWVudDI=',
              node: {
                name: 'ingredient2',
              },
            },
          ],
          pageInfo: {
            endCursor: 'aW5ncmVkaWVudDI=',
            hasNextPage: false,
            hasPreviousPage: true,
            startCursor: 'aW5ncmVkaWVudDI=',
          },
          totalCount: 1,
        });
      });

      it('should retrieve all previous ingredients to the beginning of the list', async () => {
        const { query, mutate } = createTestApolloServer(prismaClient);

        await createIngredient(mutate, {
          name: 'ingredient1',
          currency: 'NZD',
          amount: 40.2,
        });
        await createIngredient(mutate, {
          name: 'ingredient2',
          currency: 'NZD',
          amount: 40.2,
        });
        await createIngredient(mutate, {
          name: 'ingredient3',
          currency: 'NZD',
          amount: 40.2,
        });

        const response = await queryIngredientsPagination(query, {
          first: 9999,
          before: 'aW5ncmVkaWVudDM=',
        });

        expect(response.data?.ingredients).toEqual({
          edges: [
            {
              cursor: 'aW5ncmVkaWVudDE=',
              node: {
                name: 'ingredient1',
              },
            },
            {
              cursor: 'aW5ncmVkaWVudDI=',
              node: {
                name: 'ingredient2',
              },
            },
          ],
          pageInfo: {
            endCursor: 'aW5ncmVkaWVudDI=',
            hasNextPage: false,
            hasPreviousPage: false,
            startCursor: 'aW5ncmVkaWVudDE=',
          },
          totalCount: 2,
        });
      });

      it('should not retrieve any ingredients if at the beginning of the list', async () => {
        const { query, mutate } = createTestApolloServer(prismaClient);

        await createIngredient(mutate, {
          name: 'ingredient1',
          currency: 'NZD',
          amount: 40.2,
        });
        await createIngredient(mutate, {
          name: 'ingredient2',
          currency: 'NZD',
          amount: 40.2,
        });

        const response = await queryIngredientsPagination(query, {
          first: 9999,
          before: 'aW5ncmVkaWVudDE=',
        });

        expect(response.data?.ingredients).toEqual({
          edges: [],
          pageInfo: {
            endCursor: null,
            hasNextPage: true,
            hasPreviousPage: false,
            startCursor: null,
          },
          totalCount: 0,
        });
      });
    });
  });
});
