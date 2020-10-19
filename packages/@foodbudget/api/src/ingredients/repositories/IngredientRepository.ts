import logger from '@foodbudget/logger';
import { ingredients, PrismaClient } from '@prisma/client';
import { Repository, SaveOptions } from '../../shared/types/Repository.types';
import { Ingredient } from '../Ingredient.types';

export default class IngredientRepository implements Repository<Ingredient, ingredients> {
  private readonly prisma: PrismaClient;

  constructor(prisma: PrismaClient) {
    this.prisma = prisma;
  }

  get = async (ingredient: Partial<Ingredient>): Promise<ingredients[] | undefined> => {
    logger.info('get ingredient repository request: %o', ingredient);
    const result = await this.prisma.ingredients.findMany(
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

    logger.info('ingredients found: %o', result);
    return result;
  };

  getOne = async (ingredient: Partial<Ingredient>): Promise<ingredients | undefined> => {
    logger.info('get one ingredient repository request: %o', ingredient);
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

    logger.info('ingredient found: %o', result);
    return result;
  };

  private readonly upsert = async (ingredient: Ingredient, override = false) => {
    const overrideOrUpdate = (
      shouldUpdate: boolean, value: Record<string, unknown>,
    ) => (override ? value : shouldUpdate && value);

    logger.info('upsert ingredient repository request: %o', ingredient);

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

    logger.info('upserted ingredient: %o', result);

    return result;
  };

  async save(ingredientsDto: Ingredient, options?: SaveOptions): Promise<ingredients>;

  async save(ingredientsDto: Ingredient[], options?: SaveOptions): Promise<ingredients[]>;

  async save(ingredientsDto: Ingredient | Ingredient[], options?: SaveOptions):
  Promise<ingredients | ingredients[]> {
    if (Array.isArray(ingredientsDto)) {
      // As of now, Prisma 2 does not support createMany. For now, given the low amount
      // of ingredients being created per day, the number of Promises being created is fine.
      // If this becomes a bottleneck, we will have to use raw SQL under the hood.

      // See https://github.com/prisma/prisma-client-js/issues/332 for progress on this.
      return Promise.all(
        ingredientsDto.map(async (ingredient) => this.upsert(ingredient, !!options?.override)),
      );
    }
    return this.upsert(ingredientsDto, !!options?.override);
  }

  async delete(names: string): Promise<ingredients>;

  async delete(names: string[]): Promise<ingredients[]>;

  async delete(names: string | string[]): Promise<ingredients | ingredients[]> {
    logger.info('delete ingredient name repository request: %o', name);
    if (Array.isArray(names)) {
      return Promise.all(names.map(async (name) => this.prisma.ingredients.delete({
        where: {
          name,
        },
      })));
    }

    const result = await this.prisma.ingredients.delete({
      where: {
        name: names,
      },
    });

    logger.info('deleted ingredient: %o', result);
    return result;
  }
}
