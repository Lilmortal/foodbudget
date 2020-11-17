import { AppError } from '@foodbudget/errors';
import { Edge, PageInfo, Pagination } from '../../types/pagination';
import { Currency, Ingredient } from '../Ingredient.types';
import { FilterableIngredientRepository } from '../repositories/IngredientRepository';

interface PaginateParams {
  pos: number;
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

  async paginateBefore({ pos, cursor }: PaginateParams): Promise<Pagination<Ingredient> | undefined> {
    const beforeIngredients = await this.repository.paginate(
      -Math.abs(pos) - 1,
      cursor && Buffer.from(cursor, 'base64').toString('ascii'),
    );

    const afterIngredients = await this.repository.paginate(
      1,
      cursor && Buffer.from(cursor, 'base64').toString('ascii'),
    );

    const hasPreviousPage = beforeIngredients ? beforeIngredients.length > pos : false;
    const hasNextPage = cursor && afterIngredients ? afterIngredients.length > 0 : false;

    if (hasPreviousPage && pos !== 0) {
      beforeIngredients?.shift();
    }

    let edges: Edge<Ingredient>[] = [];
    let startCursor: string | null = null;
    let endCursor: string | null = null;
    let totalCount = 0;

    if (beforeIngredients && beforeIngredients.length > 0) {
      edges = edges.concat(beforeIngredients.map((ingredient) => ({
        node: { ...ingredient },
        cursor: Buffer.from(ingredient.name).toString('base64'),
      })));

      startCursor = edges[0].cursor;
      endCursor = edges[edges.length - 1].cursor;

      totalCount = edges.length;
    }

    const pageInfo: PageInfo = {
      hasPreviousPage,
      hasNextPage,
      startCursor,
      endCursor,
    };

    return { pageInfo, edges, totalCount };
  }

  async paginateAfter({ pos, cursor }: PaginateParams): Promise<Pagination<Ingredient> | undefined> {
    const beforeIngredients = await this.repository.paginate(
      -1,
      cursor && Buffer.from(cursor, 'base64').toString('ascii'),
    );

    const afterIngredients = await this.repository.paginate(
      pos + 1,
      cursor && Buffer.from(cursor, 'base64').toString('ascii'),
    );

    const hasPreviousPage = cursor && beforeIngredients ? beforeIngredients.length > 0 : false;
    const hasNextPage = afterIngredients ? afterIngredients.length > pos : false;

    if (hasNextPage && pos !== 0) {
      afterIngredients?.pop();
    }

    let edges: Edge<Ingredient>[] = [];
    let startCursor: string | null = null;
    let endCursor: string | null = null;
    let totalCount = 0;

    if (afterIngredients && afterIngredients.length > 0) {
      edges = edges.concat(afterIngredients.map((ingredient) => ({
        node: { ...ingredient },
        cursor: Buffer.from(ingredient.name).toString('base64'),
      })));

      startCursor = edges[0].cursor;
      endCursor = edges[edges.length - 1].cursor;

      totalCount = edges.length;
    }

    const pageInfo: PageInfo = {
      hasPreviousPage,
      hasNextPage,
      startCursor,
      endCursor,
    };

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
