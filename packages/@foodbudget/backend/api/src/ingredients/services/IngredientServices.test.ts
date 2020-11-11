import { mockDeep, MockProxy } from 'jest-mock-extended';
import { FilterableIngredientRepository } from '../repositories/IngredientRepository';
import { IngredientServices } from './IngredientServices';

describe('ingredient services', () => {
  let ingredientServices: IngredientServices;
  let mockIngredientRepository: MockProxy<FilterableIngredientRepository>;

  beforeEach(() => {
    mockIngredientRepository = mockDeep(mockIngredientRepository);
    ingredientServices = new IngredientServices(mockIngredientRepository);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('paginations', () => {
    describe('after ingredients', () => {
      it('should retrieve the next two ingredients', async () => {
        mockIngredientRepository.paginate.mockReturnValueOnce(new Promise((resolve) => resolve(undefined)));
        mockIngredientRepository.paginate.mockReturnValueOnce(new Promise((resolve) => resolve(
          [
            {
              name: 'ingredient2',
            },
            {
              name: 'ingredient3',
            },
            {
              name: 'ingredient4',
            },
          ],
        )));

        const result = await ingredientServices.paginate({ first: 0, last: 2 });

        expect(result).toEqual({
          pageInfo: {
            hasPreviousPage: false,
            hasNextPage: true,
            startCursor: 'aW5ncmVkaWVudDI=',
            endCursor: 'aW5ncmVkaWVudDM=',
          },
          edges: [
            {
              cursor: 'aW5ncmVkaWVudDI=',
              node: {
                name: 'ingredient2',
              },
            },
            {
              cursor: 'aW5ncmVkaWVudDM=',
              node: {
                name: 'ingredient3',
              },
            },
          ],
          totalCount: 2,
        });
      });

      it('should retrieve one ingredient when at the end of the page', async () => {
        mockIngredientRepository.paginate.mockReturnValueOnce(new Promise((resolve) => resolve(undefined)));
        mockIngredientRepository.paginate.mockReturnValueOnce(new Promise((resolve) => resolve(
          [
            {
              name: 'ingredient4',
            },
          ],
        )));

        const result = await ingredientServices.paginate({ first: 0, last: 1, cursor: 'aW5ncmVkaWVudDM=' });

        expect(result).toEqual({
          pageInfo: {
            hasPreviousPage: false,
            hasNextPage: false,
            startCursor: 'aW5ncmVkaWVudDQ=',
            endCursor: 'aW5ncmVkaWVudDQ=',
          },
          edges: [
            {
              cursor: 'aW5ncmVkaWVudDQ=',
              node: {
                name: 'ingredient4',
              },
            },
          ],
          totalCount: 1,
        });
      });
    });

    describe('previous ingredients', () => {
      it('should retrieve the previous two ingredients', async () => {
        mockIngredientRepository.paginate.mockReturnValueOnce(new Promise((resolve) => resolve(
          [
            {
              name: 'ingredient2',
            },
            {
              name: 'ingredient3',
            },
            {
              name: 'ingredient4',
            },
          ],
        )));
        mockIngredientRepository.paginate.mockReturnValueOnce(new Promise((resolve) => resolve(undefined)));

        const result = await ingredientServices.paginate({ first: 2, last: 0 });

        expect(result).toEqual({
          pageInfo: {
            hasPreviousPage: true,
            hasNextPage: false,
            startCursor: 'aW5ncmVkaWVudDM=',
            endCursor: 'aW5ncmVkaWVudDQ=',
          },
          edges: [
            {
              cursor: 'aW5ncmVkaWVudDM=',
              node: {
                name: 'ingredient3',
              },
            },
            {
              cursor: 'aW5ncmVkaWVudDQ=',
              node: {
                name: 'ingredient4',
              },
            },
          ],
          totalCount: 2,
        });
      });

      it('should retrieve one ingredient when at the start of the page', async () => {
        mockIngredientRepository.paginate.mockReturnValueOnce(new Promise((resolve) => resolve(
          [
            {
              name: 'ingredient4',
            },
          ],
        )));
        mockIngredientRepository.paginate.mockReturnValueOnce(new Promise((resolve) => resolve(undefined)));

        const result = await ingredientServices.paginate({ first: 1, last: 0, cursor: 'aW5ncmVkaWVudDM=' });

        expect(result).toEqual({
          pageInfo: {
            hasPreviousPage: false,
            hasNextPage: false,
            startCursor: 'aW5ncmVkaWVudDQ=',
            endCursor: 'aW5ncmVkaWVudDQ=',
          },
          edges: [
            {
              cursor: 'aW5ncmVkaWVudDQ=',
              node: {
                name: 'ingredient4',
              },
            },
          ],
          totalCount: 1,
        });
      });
    });

    describe('previous and after ingredients', () => {
      it('should retrieve one ingredient before and two ingredients after the cursor', async () => {
        mockIngredientRepository.paginate.mockReturnValueOnce(new Promise((resolve) => resolve(
          [
            {
              name: 'ingredient1',
            },
            {
              name: 'ingredient2',
            },
          ],
        )));
        mockIngredientRepository.paginate.mockReturnValueOnce(new Promise((resolve) => resolve(
          [
            {
              name: 'ingredient4',
            },
            {
              name: 'ingredient5',
            },
          ],
        )));

        const result = await ingredientServices.paginate({ first: 1, last: 2 });

        expect(result).toEqual({
          pageInfo: {
            hasPreviousPage: true,
            hasNextPage: false,
            startCursor: 'aW5ncmVkaWVudDI=',
            endCursor: 'aW5ncmVkaWVudDU=',
          },
          edges: [
            {
              cursor: 'aW5ncmVkaWVudDI=',
              node: {
                name: 'ingredient2',
              },
            },
            {
              cursor: 'aW5ncmVkaWVudDQ=',
              node: {
                name: 'ingredient4',
              },
            },
            {
              cursor: 'aW5ncmVkaWVudDU=',
              node: {
                name: 'ingredient5',
              },
            },
          ],
          totalCount: 3,
        });
      });

      it('should retrieve all ingredients', async () => {
        mockIngredientRepository.paginate.mockReturnValueOnce(new Promise((resolve) => resolve(
          [
            {
              name: 'ingredient1',
            },
            {
              name: 'ingredient2',
            },
          ],
        )));
        mockIngredientRepository.paginate.mockReturnValueOnce(new Promise((resolve) => resolve(
          [
            {
              name: 'ingredient4',
            },
            {
              name: 'ingredient5',
            },
          ],
        )));

        const result = await ingredientServices.paginate({ first: 9999, last: 9999 });

        expect(result).toEqual({
          pageInfo: {
            hasPreviousPage: false,
            hasNextPage: false,
            startCursor: 'aW5ncmVkaWVudDE=',
            endCursor: 'aW5ncmVkaWVudDU=',
          },
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
            {
              cursor: 'aW5ncmVkaWVudDQ=',
              node: {
                name: 'ingredient4',
              },
            },
            {
              cursor: 'aW5ncmVkaWVudDU=',
              node: {
                name: 'ingredient5',
              },
            },
          ],
          totalCount: 4,
        });
      });
    });
  });
});
