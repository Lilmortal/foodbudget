import { PrismaClient } from '@prisma/client';
import { gql } from 'apollo-server-express';
import findUp from 'find-up';
import {
  createTestApolloServer,
  createTestDatabase,
  tearDownTestDatabase,
} from '../../../utils/test';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const createRecipe = async (
  mutate: (mutation: any) => Promise<any>,
  variables: object,
) => {
  await mutate({
    mutation: gql`
      mutation saveRecipe(
        $name: String!
        $link: String!
        $prepTime: String!
        $servings: Int!
      ) {
        saveRecipe(
          name: $name
          link: $link
          prepTime: $prepTime
          servings: $servings
        ) {
          name
        }
      }
    `,
    variables,
  });
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const queryRecipePagination = async (query: any, variables: object) => {
  const response = await query({
    query: gql`
      query recipes($first: Int, $last: Int, $before: ID, $after: ID) {
        recipes(first: $first, last: $last, before: $before, after: $after) {
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

describe('recipe queries', () => {
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

  describe('pagination', () => {
    describe('last recipes', () => {
      it('should retrieve the next two recipes without a cursor', async () => {
        const { query, mutate } = createTestApolloServer(prismaClient);

        await createRecipe(mutate, {
          name: 'recipe1',
          link: 'recipeLink1',
          prepTime: '2 mins',
          servings: 2,
        });
        await createRecipe(mutate, {
          name: 'recipe2',
          link: 'recipeLink2',
          prepTime: '2 mins',
          servings: 2,
        });
        await createRecipe(mutate, {
          name: 'recipe3',
          link: 'recipeLink3',
          prepTime: '2 mins',
          servings: 2,
        });

        const response = await queryRecipePagination(query, { last: 2 });

        expect(response.data?.recipes).toEqual({
          edges: [
            {
              cursor: 'cmVjaXBlTGluazE=',
              node: {
                name: 'recipe1',
              },
            },
            {
              cursor: 'cmVjaXBlTGluazI=',
              node: {
                name: 'recipe2',
              },
            },
          ],
          pageInfo: {
            endCursor: 'cmVjaXBlTGluazI=',
            hasNextPage: true,
            hasPreviousPage: false,
            startCursor: 'cmVjaXBlTGluazE=',
          },
          totalCount: 2,
        });
      });

      it('should retrieve the next ingredient with a cursor', async () => {
        const { query, mutate } = createTestApolloServer(prismaClient);

        await createRecipe(mutate, {
          name: 'recipe1',
          link: 'recipeLink1',
          prepTime: '2 mins',
          servings: 2,
        });
        await createRecipe(mutate, {
          name: 'recipe2',
          link: 'recipeLink2',
          prepTime: '2 mins',
          servings: 2,
        });
        await createRecipe(mutate, {
          name: 'recipe3',
          link: 'recipeLink3',
          prepTime: '2 mins',
          servings: 2,
        });

        const response = await queryRecipePagination(query, {
          last: 1,
          after: 'cmVjaXBlTGluazE=',
        });

        expect(response.data?.recipes).toEqual({
          edges: [
            {
              cursor: 'cmVjaXBlTGluazI=',
              node: {
                name: 'recipe2',
              },
            },
          ],
          pageInfo: {
            endCursor: 'cmVjaXBlTGluazI=',
            hasNextPage: true,
            hasPreviousPage: false,
            startCursor: 'cmVjaXBlTGluazI=',
          },
          totalCount: 1,
        });
      });

      it('should retrieve all the recipes to the end of the list given a large last value', async () => {
        const { query, mutate } = createTestApolloServer(prismaClient);

        await createRecipe(mutate, {
          name: 'recipe1',
          link: 'recipeLink1',
          prepTime: '2 mins',
          servings: 2,
        });
        await createRecipe(mutate, {
          name: 'recipe2',
          link: 'recipeLink2',
          prepTime: '2 mins',
          servings: 2,
        });
        await createRecipe(mutate, {
          name: 'recipe3',
          link: 'recipeLink3',
          prepTime: '2 mins',
          servings: 2,
        });

        const response = await queryRecipePagination(query, {
          last: 9999,
          after: 'cmVjaXBlTGluazI=',
        });

        expect(response.data?.recipes).toEqual({
          edges: [
            {
              cursor: 'cmVjaXBlTGluazM=',
              node: {
                name: 'recipe3',
              },
            },
          ],
          pageInfo: {
            endCursor: 'cmVjaXBlTGluazM=',
            hasNextPage: false,
            hasPreviousPage: true,
            startCursor: 'cmVjaXBlTGluazM=',
          },
          totalCount: 1,
        });
      });

      it('should not retrieve any recipes if at the end of the list', async () => {
        const { query, mutate } = createTestApolloServer(prismaClient);

        await createRecipe(mutate, {
          name: 'recipe1',
          link: 'recipeLink1',
          prepTime: '2 mins',
          servings: 2,
        });
        await createRecipe(mutate, {
          name: 'recipe2',
          link: 'recipeLink2',
          prepTime: '2 mins',
          servings: 2,
        });

        const response = await queryRecipePagination(query, {
          last: 9999,
          after: 'cmVjaXBlTGluazI=',
        });

        expect(response.data?.recipes).toEqual({
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

    describe('first recipes', () => {
      it('should return the last ingredient in the list without a cursor', async () => {
        const { query, mutate } = createTestApolloServer(prismaClient);

        await createRecipe(mutate, {
          name: 'recipe1',
          link: 'recipeLink1',
          prepTime: '2 mins',
          servings: 2,
        });
        await createRecipe(mutate, {
          name: 'recipe2',
          link: 'recipeLink2',
          prepTime: '2 mins',
          servings: 2,
        });
        await createRecipe(mutate, {
          name: 'recipe3',
          link: 'recipeLink3',
          prepTime: '2 mins',
          servings: 2,
        });

        const response = await queryRecipePagination(query, { first: 1 });

        expect(response.data?.recipes).toEqual({
          edges: [
            {
              cursor: 'cmVjaXBlTGluazM=',
              node: {
                name: 'recipe3',
              },
            },
          ],
          pageInfo: {
            endCursor: 'cmVjaXBlTGluazM=',
            hasNextPage: false,
            hasPreviousPage: true,
            startCursor: 'cmVjaXBlTGluazM=',
          },
          totalCount: 1,
        });
      });

      it('should retrieve the previous ingredient with a cursor', async () => {
        const { query, mutate } = createTestApolloServer(prismaClient);

        await createRecipe(mutate, {
          name: 'recipe1',
          link: 'recipeLink1',
          prepTime: '2 mins',
          servings: 2,
        });
        await createRecipe(mutate, {
          name: 'recipe2',
          link: 'recipeLink2',
          prepTime: '2 mins',
          servings: 2,
        });
        await createRecipe(mutate, {
          name: 'recipe3',
          link: 'recipeLink3',
          prepTime: '2 mins',
          servings: 2,
        });

        const response = await queryRecipePagination(query, {
          first: 1,
          before: 'cmVjaXBlTGluazM=',
        });

        expect(response.data?.recipes).toEqual({
          edges: [
            {
              cursor: 'cmVjaXBlTGluazI=',
              node: {
                name: 'recipe2',
              },
            },
          ],
          pageInfo: {
            endCursor: 'cmVjaXBlTGluazI=',
            hasNextPage: false,
            hasPreviousPage: true,
            startCursor: 'cmVjaXBlTGluazI=',
          },
          totalCount: 1,
        });
      });

      it('should retrieve all previous recipes to the beginning of the list', async () => {
        const { query, mutate } = createTestApolloServer(prismaClient);

        await createRecipe(mutate, {
          name: 'recipe1',
          link: 'recipeLink1',
          prepTime: '2 mins',
          servings: 2,
        });
        await createRecipe(mutate, {
          name: 'recipe2',
          link: 'recipeLink2',
          prepTime: '2 mins',
          servings: 2,
        });
        await createRecipe(mutate, {
          name: 'recipe3',
          link: 'recipeLink3',
          prepTime: '2 mins',
          servings: 2,
        });

        const response = await queryRecipePagination(query, {
          first: 9999,
          before: 'cmVjaXBlTGluazM=',
        });

        expect(response.data?.recipes).toEqual({
          edges: [
            {
              cursor: 'cmVjaXBlTGluazE=',
              node: {
                name: 'recipe1',
              },
            },
            {
              cursor: 'cmVjaXBlTGluazI=',
              node: {
                name: 'recipe2',
              },
            },
          ],
          pageInfo: {
            endCursor: 'cmVjaXBlTGluazI=',
            hasNextPage: false,
            hasPreviousPage: false,
            startCursor: 'cmVjaXBlTGluazE=',
          },
          totalCount: 2,
        });
      });

      it('should not retrieve any recipes if at the beginning of the list', async () => {
        const { query, mutate } = createTestApolloServer(prismaClient);

        await createRecipe(mutate, {
          name: 'recipe1',
          link: 'recipeLink1',
          prepTime: '2 mins',
          servings: 2,
        });
        await createRecipe(mutate, {
          name: 'recipe2',
          link: 'recipeLink2',
          prepTime: '2 mins',
          servings: 2,
        });

        const response = await queryRecipePagination(query, {
          first: 9999,
          before: 'cmVjaXBlTGluazE=',
        });

        expect(response.data?.recipes).toEqual({
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
