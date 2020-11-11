import { PrismaClient } from '@prisma/client';
import { gql } from 'apollo-server-express';
import findUp from 'find-up';
import { createTestApolloServer, createTestDatabase, tearDownTestDatabase } from '../../../utils/test';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const createRecipe = async (mutate: ((mutation: any) => Promise<any>), variables: object) => {
  await mutate({
    mutation: gql`
      mutation saveRecipe($name: String!, $link: String!, $prepTime: String!, $servings: Int!) {
        saveRecipe(name: $name, link: $link, prepTime: $prepTime, servings: $servings) {
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
      query recipes($first: Int, $last: Int, $cursor: String) {
        recipes(first: $first, last: $last, cursor: $cursor) {
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

        await createRecipe(mutate, { name: 'recipe1', link: 'recipeLink1', prepTime: '2 mins', servings: 2 });
        await createRecipe(mutate, { name: 'recipe2', link: 'recipeLink2', prepTime: '2 mins', servings: 2 });
        await createRecipe(mutate, { name: 'recipe3', link: 'recipeLink3', prepTime: '2 mins', servings: 2 });

        const response = await queryRecipePagination(query, { last: 2 });

        expect(response.data?.recipes).toEqual({
          edges: [
            {
              cursor: 'MQ==',
              node: {
                name: 'recipe1',
              },
            },
            {
              cursor: 'Mg==',
              node: {
                name: 'recipe2',
              },
            },
          ],
          pageInfo: {
            endCursor: 'Mg==',
            hasNextPage: true,
            hasPreviousPage: false,
            startCursor: 'MQ==',
          },
          totalCount: 2,
        });
      });

      it('should retrieve the next ingredient with a cursor', async () => {
        const { query, mutate } = createTestApolloServer(prismaClient);

        await createRecipe(mutate, { name: 'recipe1', link: 'recipeLink1', prepTime: '2 mins', servings: 2 });
        await createRecipe(mutate, { name: 'recipe2', link: 'recipeLink2', prepTime: '2 mins', servings: 2 });
        await createRecipe(mutate, { name: 'recipe3', link: 'recipeLink3', prepTime: '2 mins', servings: 2 });

        const response = await queryRecipePagination(query, { last: 1, cursor: 'MQ==' });

        expect(response.data?.recipes).toEqual({
          edges: [
            {
              cursor: 'Mg==',
              node: {
                name: 'recipe2',
              },
            },
          ],
          pageInfo: {
            endCursor: 'Mg==',
            hasNextPage: true,
            hasPreviousPage: false,
            startCursor: 'Mg==',
          },
          totalCount: 1,
        });
      });

      it('should retrieve all the recipes to the end of the list', async () => {
        const { query, mutate } = createTestApolloServer(prismaClient);

        await createRecipe(mutate, { name: 'recipe1', link: 'recipeLink1', prepTime: '2 mins', servings: 2 });
        await createRecipe(mutate, { name: 'recipe2', link: 'recipeLink2', prepTime: '2 mins', servings: 2 });
        await createRecipe(mutate, { name: 'recipe3', link: 'recipeLink3', prepTime: '2 mins', servings: 2 });

        const response = await queryRecipePagination(query, { last: 9999, cursor: 'Mg==' });

        expect(response.data?.recipes).toEqual({
          edges: [
            {
              cursor: 'Mw==',
              node: {
                name: 'recipe3',
              },
            },
          ],
          pageInfo: {
            endCursor: 'Mw==',
            hasNextPage: false,
            hasPreviousPage: true,
            startCursor: 'Mw==',
          },
          totalCount: 1,
        });
      });

      it('should not retrieve any recipes if at the end of the list', async () => {
        const { query, mutate } = createTestApolloServer(prismaClient);

        await createRecipe(mutate, { name: 'recipe1', link: 'recipeLink1', prepTime: '2 mins', servings: 2 });
        await createRecipe(mutate, { name: 'recipe2', link: 'recipeLink2', prepTime: '2 mins', servings: 2 });

        const response = await queryRecipePagination(query, { last: 9999, cursor: 'Mg==' });

        expect(response.data?.recipes).toEqual({
          edges: [],
          pageInfo: {
            endCursor: '',
            hasNextPage: false,
            hasPreviousPage: true,
            startCursor: '',
          },
          totalCount: 0,
        });
      });
    });

    describe('first recipes', () => {
      it('should not return any ingredient and attempting to get one previous ingredient without a cursor', async () => {
        const { query, mutate } = createTestApolloServer(prismaClient);

        await createRecipe(mutate, { name: 'recipe1', link: 'recipeLink1', prepTime: '2 mins', servings: 2 });
        await createRecipe(mutate, { name: 'recipe2', link: 'recipeLink2', prepTime: '2 mins', servings: 2 });
        await createRecipe(mutate, { name: 'recipe3', link: 'recipeLink3', prepTime: '2 mins', servings: 2 });

        const response = await queryRecipePagination(query, { first: 1 });

        expect(response.data?.recipes).toEqual({
          edges: [],
          pageInfo: {
            endCursor: '',
            hasNextPage: true,
            hasPreviousPage: false,
            startCursor: '',
          },
          totalCount: 0,
        });
      });

      it('should retrieve the previous ingredient with a cursor', async () => {
        const { query, mutate } = createTestApolloServer(prismaClient);

        await createRecipe(mutate, { name: 'recipe1', link: 'recipeLink1', prepTime: '2 mins', servings: 2 });
        await createRecipe(mutate, { name: 'recipe2', link: 'recipeLink2', prepTime: '2 mins', servings: 2 });
        await createRecipe(mutate, { name: 'recipe3', link: 'recipeLink3', prepTime: '2 mins', servings: 2 });

        const response = await queryRecipePagination(query, { first: 1, cursor: 'Mw==' });

        expect(response.data?.recipes).toEqual({
          edges: [
            {
              cursor: 'Mg==',
              node: {
                name: 'recipe2',
              },
            },
          ],
          pageInfo: {
            endCursor: 'Mg==',
            hasNextPage: false,
            hasPreviousPage: true,
            startCursor: 'Mg==',
          },
          totalCount: 1,
        });
      });

      it('should retrieve all previous recipes to the beginning of the list', async () => {
        const { query, mutate } = createTestApolloServer(prismaClient);

        await createRecipe(mutate, { name: 'recipe1', link: 'recipeLink1', prepTime: '2 mins', servings: 2 });
        await createRecipe(mutate, { name: 'recipe2', link: 'recipeLink2', prepTime: '2 mins', servings: 2 });
        await createRecipe(mutate, { name: 'recipe3', link: 'recipeLink3', prepTime: '2 mins', servings: 2 });

        const response = await queryRecipePagination(query, { first: 9999, cursor: 'Mw==' });

        expect(response.data?.recipes).toEqual({
          edges: [
            {
              cursor: 'MQ==',
              node: {
                name: 'recipe1',
              },
            },
            {
              cursor: 'Mg==',
              node: {
                name: 'recipe2',
              },
            },
          ],
          pageInfo: {
            endCursor: 'Mg==',
            hasNextPage: false,
            hasPreviousPage: false,
            startCursor: 'MQ==',
          },
          totalCount: 2,
        });
      });

      it('should not retrieve any recipes if at the beginning of the list', async () => {
        const { query, mutate } = createTestApolloServer(prismaClient);

        await createRecipe(mutate, { name: 'recipe1', link: 'recipeLink1', prepTime: '2 mins', servings: 2 });
        await createRecipe(mutate, { name: 'recipe2', link: 'recipeLink2', prepTime: '2 mins', servings: 2 });

        const response = await queryRecipePagination(query, { first: 9999, cursor: 'MQ==' });

        expect(response.data?.recipes).toEqual({
          edges: [],
          pageInfo: {
            endCursor: '',
            hasNextPage: true,
            hasPreviousPage: false,
            startCursor: '',
          },
          totalCount: 0,
        });
      });
    });

    describe('first and last recipes', () => {
      it('should retrieve one ingredient before the cursor and two recipes after', async () => {
        const { query, mutate } = createTestApolloServer(prismaClient);

        await createRecipe(mutate, { name: 'recipe1', link: 'recipeLink1', prepTime: '2 mins', servings: 2 });
        await createRecipe(mutate, { name: 'recipe2', link: 'recipeLink2', prepTime: '2 mins', servings: 2 });
        await createRecipe(mutate, { name: 'recipe3', link: 'recipeLink3', prepTime: '2 mins', servings: 2 });
        await createRecipe(mutate, { name: 'recipe4', link: 'recipeLink4', prepTime: '2 mins', servings: 2 });
        await createRecipe(mutate, { name: 'recipe5', link: 'recipeLink5', prepTime: '2 mins', servings: 2 });

        const response = await queryRecipePagination(query, { first: 1, last: 2, cursor: 'Mw==' });

        expect(response.data?.recipes).toEqual({
          edges: [
            {
              cursor: 'Mg==',
              node: {
                name: 'recipe2',
              },
            },
            {
              cursor: 'NA==',
              node: {
                name: 'recipe4',
              },
            },
            {
              cursor: 'NQ==',
              node: {
                name: 'recipe5',
              },
            },
          ],
          pageInfo: {
            endCursor: 'NQ==',
            hasNextPage: false,
            hasPreviousPage: true,
            startCursor: 'Mg==',
          },
          totalCount: 3,
        });
      });

      it('should retrieve all the recipes except the cursor', async () => {
        const { query, mutate } = createTestApolloServer(prismaClient);

        await createRecipe(mutate, { name: 'recipe1', link: 'recipeLink1', prepTime: '2 mins', servings: 2 });
        await createRecipe(mutate, { name: 'recipe2', link: 'recipeLink2', prepTime: '2 mins', servings: 2 });
        await createRecipe(mutate, { name: 'recipe3', link: 'recipeLink3', prepTime: '2 mins', servings: 2 });
        await createRecipe(mutate, { name: 'recipe4', link: 'recipeLink4', prepTime: '2 mins', servings: 2 });
        await createRecipe(mutate, { name: 'recipe5', link: 'recipeLink5', prepTime: '2 mins', servings: 2 });

        const response = await queryRecipePagination(query, { first: 999, last: 999, cursor: 'Mw==' });

        expect(response.data?.recipes).toEqual({
          edges: [
            {
              cursor: 'MQ==',
              node: {
                name: 'recipe1',
              },
            },
            {
              cursor: 'Mg==',
              node: {
                name: 'recipe2',
              },
            },
            {
              cursor: 'NA==',
              node: {
                name: 'recipe4',
              },
            },
            {
              cursor: 'NQ==',
              node: {
                name: 'recipe5',
              },
            },
          ],
          pageInfo: {
            endCursor: 'NQ==',
            hasNextPage: false,
            hasPreviousPage: false,
            startCursor: 'MQ==',
          },
          totalCount: 4,
        });
      });

      it('should retrieve all the recipes without a cursor', async () => {
        const { query, mutate } = createTestApolloServer(prismaClient);

        await createRecipe(mutate, { name: 'recipe1', link: 'recipeLink1', prepTime: '2 mins', servings: 2 });
        await createRecipe(mutate, { name: 'recipe2', link: 'recipeLink2', prepTime: '2 mins', servings: 2 });
        await createRecipe(mutate, { name: 'recipe3', link: 'recipeLink3', prepTime: '2 mins', servings: 2 });

        const response = await queryRecipePagination(query, { first: 999, last: 999 });

        expect(response.data?.recipes).toEqual({
          edges: [
            {
              cursor: 'MQ==',
              node: {
                name: 'recipe1',
              },
            },
            {
              cursor: 'Mg==',
              node: {
                name: 'recipe2',
              },
            },
            {
              cursor: 'Mw==',
              node: {
                name: 'recipe3',
              },
            },
          ],
          pageInfo: {
            endCursor: 'Mw==',
            hasNextPage: false,
            hasPreviousPage: false,
            startCursor: 'MQ==',
          },
          totalCount: 3,
        });
      });
    });
  });
});
