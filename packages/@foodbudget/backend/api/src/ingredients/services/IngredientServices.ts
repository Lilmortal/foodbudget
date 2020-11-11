import { AppError } from '@foodbudget/errors';
import { Edge, PageInfo, Pagination } from '../../types/pagination';
import { Currency, Ingredient } from '../Ingredient.types';
import { FilterableIngredientRepository } from '../repositories/IngredientRepository';

interface PaginateParams {
  first?: number;
  last?: number;
  cursor?: string;
}

export class IngredientServices {
  constructor(private readonly repository: FilterableIngredientRepository) {
    this.repository = repository;
  }

  async get(ingredientsDto: Partial<Ingredient>): Promise<Ingredient[] | undefined> {
    const ingredients = await this.repository.get(ingredientsDto);
    return ingredients;
  }

  async paginate({ first, last, cursor }: PaginateParams): Promise<Pagination<Ingredient> | undefined> {
    const beforePos = first || 0;
    const beforeIngredients = await this.repository.paginate(
      -Math.abs(beforePos) - 1, Buffer.from(cursor || '', 'base64').toString('ascii'),
    );

    const afterPos = last || 0;
    const afterIngredients = await this.repository.paginate(
      Math.abs(afterPos) + 1, Buffer.from(cursor || '', 'base64').toString('ascii'),
    );

    const hasPreviousPage = beforeIngredients ? beforeIngredients.length > beforePos : false;
    const hasNextPage = afterIngredients ? afterIngredients.length > afterPos : false;

    if (hasPreviousPage) {
      beforeIngredients?.shift();
    }

    if (hasNextPage) {
      afterIngredients?.pop();
    }

    let edges: Edge<Ingredient>[] = [];

    if (beforeIngredients && beforeIngredients.length > 0) {
      edges = edges.concat(beforeIngredients.map((ingredient) => ({
        node: { ...ingredient },
        cursor: Buffer.from(ingredient.name).toString('base64'),
      })));
    }

    if (afterIngredients && afterIngredients.length > 0) {
      edges = edges.concat(afterIngredients.map((ingredient) => ({
        node: { ...ingredient },
        cursor: Buffer.from(ingredient.name).toString('base64'),
      })));
    }

    let startCursor = '';
    if (beforeIngredients && beforeIngredients.length > 0) {
      startCursor = Buffer.from(beforeIngredients[0].name).toString('base64');
    } else if (afterIngredients && afterIngredients.length > 0) {
      startCursor = Buffer.from(afterIngredients[0].name).toString('base64');
    }

    let endCursor = '';
    if (afterIngredients && afterIngredients.length > 0) {
      endCursor = Buffer.from(afterIngredients[afterIngredients.length - 1].name).toString('base64');
    } else if (beforeIngredients && beforeIngredients.length > 0) {
      endCursor = Buffer.from(beforeIngredients[beforeIngredients.length - 1].name).toString('base64');
    }

    const pageInfo: PageInfo = {
      hasPreviousPage,
      hasNextPage,
      startCursor,
      endCursor,
    };

    const totalCount = edges ? edges.length : 0;

    return { pageInfo, edges, totalCount };
  }

  async filterByPrice(currency: Currency, minAmount: number, maxAmount?: number): Promise<Ingredient[] | undefined> {
    if (maxAmount !== undefined && minAmount > maxAmount) {
      throw new AppError({
        message: 'minAmount must be less than or equal to maxAmount',
        isOperational: true,
      });
    }

    const filteredIngredients = await this.repository.filterByPrice(currency, minAmount, maxAmount);
    return filteredIngredients;
  }

  async save(ingredientsDto: Ingredient): Promise<Ingredient>;

  async save(ingredientsDto: Ingredient[]): Promise<Ingredient[]>;

  async save(ingredientsDto: Ingredient | Ingredient[]): Promise<Ingredient | Ingredient[]>;

  async save(ingredientsDto: Ingredient | Ingredient[]): Promise<Ingredient | Ingredient[]> {
    if (Array.isArray(ingredientsDto)) {
      return Promise.all(ingredientsDto.map(async (ingredient) => this.repository.save(ingredient)));
    }

    return this.repository.save(ingredientsDto);
  }
}
