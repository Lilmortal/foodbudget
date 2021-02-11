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
        mockIngredientRepository.paginate.mockReturnValueOnce(
          new Promise((resolve) => resolve(undefined)),
        );
        mockIngredientRepository.paginate.mockReturnValueOnce(
          new Promise((resolve) =>
            resolve([
              {
                name: 'ingredient2',
              },
              {
                name: 'ingredient3',
              },
              {
                name: 'ingredient4',
              },
            ]),
          ),
        );

        const result = await ingredientServices.paginateAfter({ pos: 2 });

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

      it('should retrieve one ingredient when at the end of the page given a large pos value', async () => {
        mockIngredientRepository.paginate.mockReturnValueOnce(
          new Promise((resolve) => resolve(undefined)),
        );
        mockIngredientRepository.paginate.mockReturnValueOnce(
          new Promise((resolve) =>
            resolve([
              {
                name: 'ingredient4',
              },
            ]),
          ),
        );

        const result = await ingredientServices.paginateAfter({
          pos: 9999,
          cursor: 'aW5ncmVkaWVudDM=',
        });

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
        mockIngredientRepository.paginate.mockReturnValueOnce(
          new Promise((resolve) =>
            resolve([
              {
                name: 'ingredient2',
              },
              {
                name: 'ingredient3',
              },
              {
                name: 'ingredient4',
              },
            ]),
          ),
        );
        mockIngredientRepository.paginate.mockReturnValueOnce(
          new Promise((resolve) => resolve(undefined)),
        );

        const result = await ingredientServices.paginateBefore({ pos: 2 });

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

      it('should retrieve one ingredient when at the start of the page give a large pos value', async () => {
        mockIngredientRepository.paginate.mockReturnValueOnce(
          new Promise((resolve) =>
            resolve([
              {
                name: 'ingredient4',
              },
            ]),
          ),
        );
        mockIngredientRepository.paginate.mockReturnValueOnce(
          new Promise((resolve) => resolve(undefined)),
        );

        const result = await ingredientServices.paginateBefore({
          pos: 9999,
          cursor: 'aW5ncmVkaWVudDM=',
        });

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
  });
});
