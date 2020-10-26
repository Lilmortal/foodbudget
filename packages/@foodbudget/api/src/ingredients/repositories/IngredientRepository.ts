import logger from '@foodbudget/logger';
import { PrismaClient } from '@prisma/client';
import { Repository, SaveOptions } from '../../shared/types/Repository.types';
import { Currency, Ingredient } from '../Ingredient.types';
import ingredientMapper from './ingredientMapper';

export interface FilterableIngredientRepository extends Repository<Ingredient> {
  filterByPrice(currency: Currency, minAmount: number, maxAmount?: number): Promise<Ingredient[]>;
}

export default class IngredientRepository implements FilterableIngredientRepository {
  private readonly prisma: PrismaClient;

  constructor(prisma: PrismaClient) {
    this.prisma = prisma;
  }

  filterByPrice = async (currency: Currency, minAmount: number, maxAmount?: number): Promise<Ingredient[]> => {
    logger.info('filter ingredient by price repository request');

    const results = await this.prisma.ingredients.findMany(
      {
        where: {
          price_currency: currency,
          AND: [
            {
              ...maxAmount !== undefined && {
                price_amount: {
                  lte: maxAmount,
                },
              },
            },
            {
              price_amount: {
                gte: minAmount,
              },
            },
          ],
        },
      },
    );

    return results.map((result) => ingredientMapper.toDto(result));
  };

  get = async (ingredient: Partial<Ingredient>): Promise<Ingredient[] | undefined> => {
    logger.info('get ingredient repository request', ingredient);
    const results = await this.prisma.ingredients.findMany(
      {
        where: {
          name: ingredient.name,
          price_currency: ingredient.price?.currency,
          price_amount: ingredient.price?.amount,
        },
        include: {
          recipe_ingredients: true,
        },
      },
    );

    logger.info('ingredients found', results);
    return results.map((result) => ingredientMapper.toDto(result));
  };

  getOne = async (ingredient: Partial<Ingredient>): Promise<Ingredient | undefined> => {
    logger.info('get one ingredient repository request', ingredient);
    const result = await this.prisma.ingredients.findOne(
      {
        where: {
          name: ingredient.name,
        },

      },
    );

    if (result === null) {
      return undefined;
    }

    logger.info('ingredient found', result);
    return ingredientMapper.toDto(result);
  };

  private readonly upsert = async (ingredient: Ingredient, override = false) => {
    const overrideOrUpdate = (
      shouldUpdate: boolean, value: Record<string, unknown>,
    ) => (override ? value : shouldUpdate && value);

    logger.info('upsert ingredient repository request', ingredient);

    const result = await this.prisma.ingredients.upsert({
      create: {
        name: ingredient.name,
        price_currency: ingredient.price.currency,
        price_amount: ingredient.price.amount,
      },
      update: {
        ...overrideOrUpdate(!!ingredient.name, { name: ingredient.name }),
        ...overrideOrUpdate(!!ingredient.price.currency, { price_currency: ingredient.price.currency }),
        ...overrideOrUpdate(ingredient.price.amount !== undefined, { price_amount: ingredient.price.amount }),
      },
      where: {
        name: ingredient.name,
      },
    });

    logger.info('upserted ingredient', result);

    return result;
  };

  async save(ingredientsDto: Ingredient, options?: SaveOptions): Promise<Ingredient>;

  async save(ingredientsDto: Ingredient[], options?: SaveOptions): Promise<Ingredient[]>;

  async save(ingredientsDto: Ingredient | Ingredient[], options?: SaveOptions):
  Promise<Ingredient | Ingredient[]> {
    if (Array.isArray(ingredientsDto)) {
      // As of now, Prisma 2 does not support createMany. For now, given the low amount
      // of ingredients being created per day, the number of Promises being created is fine.
      // If this becomes a bottleneck, we will have to use raw SQL under the hood.

      // See https://github.com/prisma/prisma-client-js/issues/332 for progress on this.
      return Promise.all(
        ingredientsDto.map(async (ingredient) => {
          const results = await this.upsert(ingredient, !!options?.override);
          return ingredientMapper.toDto(results);
        }),
      );
    }
    const results = await this.upsert(ingredientsDto, !!options?.override);
    return ingredientMapper.toDto(results);
  }

  async delete(names: string): Promise<Ingredient>;

  async delete(names: string[]): Promise<Ingredient[]>;

  async delete(names: string | string[]): Promise<Ingredient | Ingredient[]> {
    logger.info('delete ingredient name repository request', name);
    if (Array.isArray(names)) {
      return Promise.all(names.map(async (name) => {
        const result = await this.prisma.ingredients.delete({
          where: {
            name,
          },
        });
        return ingredientMapper.toDto(result);
      }));
    }

    const result = await this.prisma.ingredients.delete({
      where: {
        name: names,
      },
    });

    logger.info('deleted ingredient', result);
    return ingredientMapper.toDto(result);
  }
}
