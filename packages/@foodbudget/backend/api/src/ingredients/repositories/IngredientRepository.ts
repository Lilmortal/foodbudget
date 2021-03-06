import logger from '@foodbudget/logger';
import { PrismaClient } from '@prisma/client';
import { performanceTest } from '../../perf';
import { PaginationRepository } from '../../types/pagination/PaginationRepository';
import { SaveOptions } from '../../types/SaveOptions';
import { Currency, Ingredient } from '../Ingredient.types';
import { ingredientMapper } from './ingredientMapper';

export interface FilterableIngredientRepository
  extends PaginationRepository<Ingredient> {
  filterByPrice(
    currency: Currency,
    minAmount: number,
    maxAmount?: number,
  ): Promise<Ingredient[]>;
}

export class IngredientRepository implements FilterableIngredientRepository {
  private readonly prisma: PrismaClient;

  constructor(prisma: PrismaClient) {
    this.prisma = prisma;
  }

  filterByPrice = async (
    currency: Currency,
    minAmount: number,
    maxAmount?: number,
  ): Promise<Ingredient[]> => {
    logger.info('filter ingredient by price repository request');
    performanceTest.start('filter ingredient prices');

    const results = await this.prisma.ingredients.findMany({
      where: {
        price_currency: currency,
        AND: [
          {
            ...(maxAmount !== undefined && {
              price_amount: {
                lte: maxAmount,
              },
            }),
          },
          {
            price_amount: {
              gte: minAmount,
            },
          },
        ],
      },
    });

    performanceTest.end('filter ingredient prices');
    return results.map((result) => ingredientMapper.toDto(result));
  };

  get = async (
    ingredient: Partial<Ingredient>,
  ): Promise<Ingredient[] | undefined> => {
    logger.info('get ingredient repository request', ingredient);
    performanceTest.start('get ingredients');

    const results = await this.prisma.ingredients.findMany({
      where: {
        name: ingredient.name,
        price_currency: ingredient.price?.currency,
        price_amount: ingredient.price?.amount,
      },
      include: {
        recipe_ingredients: true,
      },
      cursor: {
        name: ingredient.name,
      },
    });

    performanceTest.end('get ingredients');
    logger.info('ingredients found', results);
    return results.map((result) => ingredientMapper.toDto(result));
  };

  paginate = async (
    take: number,
    cursor: string,
    skip?: number,
  ): Promise<Ingredient[] | undefined> => {
    logger.info('get ingredient repository paginate request', { take, cursor });
    performanceTest.start('get paginate ingredients');

    const results = await this.prisma.ingredients.findMany({
      include: {
        recipe_ingredients: true,
      },
      ...(cursor && {
        cursor: {
          name: cursor,
        },
      }),
      take,
      skip: skip ?? cursor ? 1 : 0,
    });

    performanceTest.end('get paginate ingredients');
    logger.info('paginate ingredients found', results);
    return results.map((result) => ingredientMapper.toDto(result));
  };

  getOne = async (
    ingredient: Partial<Ingredient>,
  ): Promise<Ingredient | undefined> => {
    logger.info('get one ingredient repository request', ingredient);
    performanceTest.start('get ingredient');

    const result = await this.prisma.ingredients.findOne({
      where: {
        name: ingredient.name,
      },
    });

    if (result === null) {
      return undefined;
    }

    performanceTest.end('get ingredient');
    logger.info('ingredient found', result);
    return ingredientMapper.toDto(result);
  };

  private readonly upsert = async (
    ingredient: Ingredient,
    override = false,
  ) => {
    const overrideOrUpdate = (
      shouldUpdate: boolean,
      value: Record<string, unknown>,
    ) => (override ? value : shouldUpdate && value);

    logger.info('upsert ingredient repository request', ingredient);

    const result = await this.prisma.ingredients.upsert({
      create: {
        name: ingredient.name,
        price_currency: ingredient.price?.currency,
        price_amount: ingredient.price?.amount,
      },
      update: {
        ...overrideOrUpdate(!!ingredient.name, { name: ingredient.name }),
        ...overrideOrUpdate(!!ingredient.price?.currency, {
          price_currency: ingredient.price?.currency,
        }),
        ...overrideOrUpdate(ingredient.price?.amount !== undefined, {
          price_amount: ingredient.price?.amount,
        }),
      },
      where: {
        name: ingredient.name,
      },
    });

    logger.info('upserted ingredient', result);

    return result;
  };

  async save(
    ingredientsDto: Ingredient,
    options?: SaveOptions,
  ): Promise<Ingredient>;

  async save(
    ingredientsDto: Ingredient[],
    options?: SaveOptions,
  ): Promise<Ingredient[]>;

  async save(
    ingredientsDto: Ingredient | Ingredient[],
    options?: SaveOptions,
  ): Promise<Ingredient | Ingredient[]> {
    if (Array.isArray(ingredientsDto)) {
      // As of now, Prisma 2 does not support createMany. For now, given the low amount
      // of ingredients being created per day, the number of Promises being created is fine.
      // If this becomes a bottleneck, we will have to use raw SQL under the hood.

      // See https://github.com/prisma/prisma-client-js/issues/332 for progress on this.
      performanceTest.start('save ingredients');

      const results = await Promise.all(
        ingredientsDto.map(async (ingredient) => {
          const upsertedResult = await this.upsert(
            ingredient,
            !!options?.override,
          );
          return ingredientMapper.toDto(upsertedResult);
        }),
      );

      performanceTest.end('save ingredients');
      return results;
    }

    performanceTest.start('save ingredient');
    const results = await this.upsert(ingredientsDto, !!options?.override);
    performanceTest.end('save ingredient');
    return ingredientMapper.toDto(results);
  }

  async delete(names: string): Promise<Ingredient>;

  async delete(names: string[]): Promise<Ingredient[]>;

  async delete(names: string | string[]): Promise<Ingredient | Ingredient[]> {
    logger.info('delete ingredient name repository request', name);
    if (Array.isArray(names)) {
      performanceTest.start('delete ingredients');
      const results = await Promise.all(
        names.map(async (name) => {
          const result = await this.prisma.ingredients.delete({
            where: {
              name,
            },
          });
          return ingredientMapper.toDto(result);
        }),
      );

      performanceTest.end('delete ingredients');
      return results;
    }

    performanceTest.start('delete ingredient');
    const result = await this.prisma.ingredients.delete({
      where: {
        name: names,
      },
    });

    performanceTest.end('delete ingredient');
    logger.info('deleted ingredient', result);
    return ingredientMapper.toDto(result);
  }
}
