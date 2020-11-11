import { mockDeep, MockProxy } from 'jest-mock-extended';
import { PaginationRepository } from '../../types/pagination/PaginationRepository';
import { Recipe } from '../Recipe.types';
import { RecipeServices } from './RecipeServices';

describe('recipe services', () => {
  let recipeServices: RecipeServices;
  let mockRecipeRepository: MockProxy<PaginationRepository<Recipe>>;

  beforeEach(() => {
    mockRecipeRepository = mockDeep(mockRecipeRepository);
    recipeServices = new RecipeServices(mockRecipeRepository);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('paginations', () => {
    describe('after recipes', () => {
      it('should retrieve the next two recipes', async () => {
        mockRecipeRepository.paginate.mockReturnValueOnce(new Promise((resolve) => resolve(undefined)));
        mockRecipeRepository.paginate.mockReturnValueOnce(new Promise((resolve) => resolve(
          [
            {
              id: 2,
              link: 'recipe1Link',
              prepTime: '2 mins',
              servings: 3,
              numSaved: 1,
              name: 'recipe 1',
              ingredients: [],
              allergies: [],
              adjectives: [],
              meals: [],
              cuisines: [],
              diets: [],
            },
            {
              id: 3,
              link: 'recipe2Link',
              prepTime: '2 mins',
              servings: 3,
              numSaved: 1,
              name: 'recipe 2',
              ingredients: [],
              allergies: [],
              adjectives: [],
              meals: [],
              cuisines: [],
              diets: [],
            },
            {
              id: 4,
              link: 'recipe3Link',
              prepTime: '2 mins',
              servings: 3,
              numSaved: 1,
              name: 'recipe 3',
              ingredients: [],
              allergies: [],
              adjectives: [],
              meals: [],
              cuisines: [],
              diets: [],
            },
          ],
        )));

        const result = await recipeServices.paginate({ first: 0, last: 2 });

        expect(result).toEqual({
          pageInfo: {
            hasPreviousPage: false,
            hasNextPage: true,
            startCursor: 'Mg==',
            endCursor: 'Mw==',
          },
          edges: [
            {
              cursor: 'Mg==',
              node: {
                id: 2,
                link: 'recipe1Link',
                prepTime: '2 mins',
                servings: 3,
                numSaved: 1,
                name: 'recipe 1',
                ingredients: [],
                allergies: [],
                adjectives: [],
                meals: [],
                cuisines: [],
                diets: [],
              },
            },
            {
              cursor: 'Mw==',
              node: {
                id: 3,
                link: 'recipe2Link',
                prepTime: '2 mins',
                servings: 3,
                numSaved: 1,
                name: 'recipe 2',
                ingredients: [],
                allergies: [],
                adjectives: [],
                meals: [],
                cuisines: [],
                diets: [],
              },
            },
          ],
          totalCount: 2,
        });
      });

      it('should retrieve one ingredient when at the end of the page', async () => {
        mockRecipeRepository.paginate.mockReturnValueOnce(new Promise((resolve) => resolve(undefined)));
        mockRecipeRepository.paginate.mockReturnValueOnce(new Promise((resolve) => resolve(
          [
            {
              id: 2,
              link: 'recipe1Link',
              prepTime: '2 mins',
              servings: 3,
              numSaved: 1,
              name: 'recipe 1',
              ingredients: [],
              allergies: [],
              adjectives: [],
              meals: [],
              cuisines: [],
              diets: [],
            },
          ],
        )));

        const result = await recipeServices.paginate({ first: 0, last: 1, cursor: 'aW5ncmVkaWVudDM=' });

        expect(result).toEqual({
          pageInfo: {
            hasPreviousPage: false,
            hasNextPage: false,
            startCursor: 'Mg==',
            endCursor: 'Mg==',
          },
          edges: [
            {
              cursor: 'Mg==',
              node: {
                id: 2,
                link: 'recipe1Link',
                prepTime: '2 mins',
                servings: 3,
                numSaved: 1,
                name: 'recipe 1',
                ingredients: [],
                allergies: [],
                adjectives: [],
                meals: [],
                cuisines: [],
                diets: [],
              },
            },
          ],
          totalCount: 1,
        });
      });
    });

    describe('previous recipes', () => {
      it('should retrieve the previous two recipes', async () => {
        mockRecipeRepository.paginate.mockReturnValueOnce(new Promise((resolve) => resolve(
          [
            {
              id: 2,
              link: 'recipe1Link',
              prepTime: '2 mins',
              servings: 3,
              numSaved: 1,
              name: 'recipe 1',
              ingredients: [],
              allergies: [],
              adjectives: [],
              meals: [],
              cuisines: [],
              diets: [],
            },
            {
              id: 3,
              link: 'recipe2Link',
              prepTime: '2 mins',
              servings: 3,
              numSaved: 1,
              name: 'recipe 2',
              ingredients: [],
              allergies: [],
              adjectives: [],
              meals: [],
              cuisines: [],
              diets: [],
            },
            {
              id: 4,
              link: 'recipe3Link',
              prepTime: '2 mins',
              servings: 3,
              numSaved: 1,
              name: 'recipe 3',
              ingredients: [],
              allergies: [],
              adjectives: [],
              meals: [],
              cuisines: [],
              diets: [],
            },
          ],
        )));
        mockRecipeRepository.paginate.mockReturnValueOnce(new Promise((resolve) => resolve(undefined)));

        const result = await recipeServices.paginate({ first: 2, last: 0 });

        expect(result).toEqual({
          pageInfo: {
            hasPreviousPage: true,
            hasNextPage: false,
            startCursor: 'Mw==',
            endCursor: 'NA==',
          },
          edges: [
            {
              cursor: 'Mw==',
              node: {
                id: 3,
                link: 'recipe2Link',
                prepTime: '2 mins',
                servings: 3,
                numSaved: 1,
                name: 'recipe 2',
                ingredients: [],
                allergies: [],
                adjectives: [],
                meals: [],
                cuisines: [],
                diets: [],
              },
            },
            {
              cursor: 'NA==',
              node: {
                id: 4,
                link: 'recipe3Link',
                prepTime: '2 mins',
                servings: 3,
                numSaved: 1,
                name: 'recipe 3',
                ingredients: [],
                allergies: [],
                adjectives: [],
                meals: [],
                cuisines: [],
                diets: [] },
            },
          ],
          totalCount: 2,
        });
      });

      it('should retrieve one ingredient when at the start of the page', async () => {
        mockRecipeRepository.paginate.mockReturnValueOnce(new Promise((resolve) => resolve(
          [
            {
              id: 2,
              link: 'recipe1Link',
              prepTime: '2 mins',
              servings: 3,
              numSaved: 1,
              name: 'recipe 1',
              ingredients: [],
              allergies: [],
              adjectives: [],
              meals: [],
              cuisines: [],
              diets: [],
            },
          ],
        )));
        mockRecipeRepository.paginate.mockReturnValueOnce(new Promise((resolve) => resolve(undefined)));

        const result = await recipeServices.paginate({ first: 1, last: 0 });

        expect(result).toEqual({
          pageInfo: {
            hasPreviousPage: false,
            hasNextPage: false,
            startCursor: 'Mg==',
            endCursor: 'Mg==',
          },
          edges: [
            {
              cursor: 'Mg==',
              node: {
                id: 2,
                link: 'recipe1Link',
                prepTime: '2 mins',
                servings: 3,
                numSaved: 1,
                name: 'recipe 1',
                ingredients: [],
                allergies: [],
                adjectives: [],
                meals: [],
                cuisines: [],
                diets: [],
              },
            },
          ],
          totalCount: 1,
        });
      });
    });

    describe('previous and after recipes', () => {
      it('should retrieve one ingredient before and two recipes after the cursor', async () => {
        mockRecipeRepository.paginate.mockReturnValueOnce(new Promise((resolve) => resolve(
          [
            {
              id: 1,
              link: 'recipe1Link',
              prepTime: '2 mins',
              servings: 3,
              numSaved: 1,
              name: 'recipe 1',
              ingredients: [],
              allergies: [],
              adjectives: [],
              meals: [],
              cuisines: [],
              diets: [],
            },
            {
              id: 2,
              link: 'recipe2Link',
              prepTime: '2 mins',
              servings: 3,
              numSaved: 1,
              name: 'recipe 2',
              ingredients: [],
              allergies: [],
              adjectives: [],
              meals: [],
              cuisines: [],
              diets: [],
            },
          ],
        )));
        mockRecipeRepository.paginate.mockReturnValueOnce(new Promise((resolve) => resolve(
          [
            {
              id: 3,
              link: 'recipe3Link',
              prepTime: '2 mins',
              servings: 3,
              numSaved: 1,
              name: 'recipe 3',
              ingredients: [],
              allergies: [],
              adjectives: [],
              meals: [],
              cuisines: [],
              diets: [],
            },
            {
              id: 4,
              link: 'recipe4Link',
              prepTime: '2 mins',
              servings: 3,
              numSaved: 1,
              name: 'recipe 4',
              ingredients: [],
              allergies: [],
              adjectives: [],
              meals: [],
              cuisines: [],
              diets: [],
            },
          ],
        )));

        const result = await recipeServices.paginate({ first: 1, last: 2 });

        expect(result).toEqual({
          pageInfo: {
            hasPreviousPage: true,
            hasNextPage: false,
            startCursor: 'Mg==',
            endCursor: 'NA==',
          },
          edges: [
            {
              cursor: 'Mg==',
              node: {
                id: 2,
                link: 'recipe2Link',
                prepTime: '2 mins',
                servings: 3,
                numSaved: 1,
                name: 'recipe 2',
                ingredients: [],
                allergies: [],
                adjectives: [],
                meals: [],
                cuisines: [],
                diets: [],
              },
            }, {
              cursor: 'Mw==',
              node: {
                id: 3,
                link: 'recipe3Link',
                prepTime: '2 mins',
                servings: 3,
                numSaved: 1,
                name: 'recipe 3',
                ingredients: [],
                allergies: [],
                adjectives: [],
                meals: [],
                cuisines: [],
                diets: [],
              },
            }, {
              cursor: 'NA==',
              node: {
                id: 4,
                link: 'recipe4Link',
                prepTime: '2 mins',
                servings: 3,
                numSaved: 1,
                name: 'recipe 4',
                ingredients: [],
                allergies: [],
                adjectives: [],
                meals: [],
                cuisines: [],
                diets: [],
              },
            },
          ],
          totalCount: 3,
        });
      });

      it('should retrieve all recipes', async () => {
        mockRecipeRepository.paginate.mockReturnValueOnce(new Promise((resolve) => resolve(
          [
            {
              id: 1,
              link: 'recipe1Link',
              prepTime: '2 mins',
              servings: 3,
              numSaved: 1,
              name: 'recipe 1',
              ingredients: [],
              allergies: [],
              adjectives: [],
              meals: [],
              cuisines: [],
              diets: [],
            },
            {
              id: 2,
              link: 'recipe2Link',
              prepTime: '2 mins',
              servings: 3,
              numSaved: 1,
              name: 'recipe 2',
              ingredients: [],
              allergies: [],
              adjectives: [],
              meals: [],
              cuisines: [],
              diets: [],
            },
          ],
        )));
        mockRecipeRepository.paginate.mockReturnValueOnce(new Promise((resolve) => resolve(
          [
            {
              id: 3,
              link: 'recipe3Link',
              prepTime: '2 mins',
              servings: 3,
              numSaved: 1,
              name: 'recipe 3',
              ingredients: [],
              allergies: [],
              adjectives: [],
              meals: [],
              cuisines: [],
              diets: [],
            },
            {
              id: 4,
              link: 'recipe4Link',
              prepTime: '2 mins',
              servings: 3,
              numSaved: 1,
              name: 'recipe 4',
              ingredients: [],
              allergies: [],
              adjectives: [],
              meals: [],
              cuisines: [],
              diets: [],
            },
          ],
        )));

        const result = await recipeServices.paginate({ first: 9999, last: 9999 });

        expect(result).toEqual({
          pageInfo: {
            hasPreviousPage: false,
            hasNextPage: false,
            startCursor: 'MQ==',
            endCursor: 'NA==',
          },
          edges: [
            {
              cursor: 'MQ==',
              node: {
                id: 1,
                link: 'recipe1Link',
                prepTime: '2 mins',
                servings: 3,
                numSaved: 1,
                name: 'recipe 1',
                ingredients: [],
                allergies: [],
                adjectives: [],
                meals: [],
                cuisines: [],
                diets: [],
              },
            }, {
              cursor: 'Mg==',
              node: {
                id: 2,
                link: 'recipe2Link',
                prepTime: '2 mins',
                servings: 3,
                numSaved: 1,
                name: 'recipe 2',
                ingredients: [],
                allergies: [],
                adjectives: [],
                meals: [],
                cuisines: [],
                diets: [],
              },
            }, {
              cursor: 'Mw==',
              node: {
                id: 3,
                link: 'recipe3Link',
                prepTime: '2 mins',
                servings: 3,
                numSaved: 1,
                name: 'recipe 3',
                ingredients: [],
                allergies: [],
                adjectives: [],
                meals: [],
                cuisines: [],
                diets: [],
              },
            }, {
              cursor: 'NA==',
              node: {
                id: 4,
                link: 'recipe4Link',
                prepTime: '2 mins',
                servings: 3,
                numSaved: 1,
                name: 'recipe 4',
                ingredients: [],
                allergies: [],
                adjectives: [],
                meals: [],
                cuisines: [],
                diets: [],
              },
            },
          ],
          totalCount: 4,
        });
      });
    });
  });
});
