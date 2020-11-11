import logger from '@foodbudget/logger';
import { PrismaClient } from '@prisma/client';
import { AppError } from '@foodbudget/errors';
import { IngredientServices } from '../../ingredients/services';
import { Recipe } from '../Recipe.types';
import { recipeMapper } from './recipeMapper';
import { performanceTest } from '../../perf';
import { Repository } from '../../types/Repository';
import { PartialBy } from '../../types/PartialBy';
import { SaveOptions } from '../../types/SaveOptions';

export class RecipeRepository implements Repository<Recipe> {
  constructor(private readonly prisma: PrismaClient, private readonly ingredientsService: IngredientServices) {
    this.prisma = prisma;
    this.ingredientsService = ingredientsService;
  }

  paginate = async (take: number, cursor: string): Promise<Recipe[] | undefined> => {
    logger.info('get recipe repository paginate request', { take, cursor });
    performanceTest.start('get paginate recipes');
    const results = await this.prisma.recipes.findMany(
      {
        include: {
          ingredients: {
            select: {
              ingredient: {
                select: {
                  name: true,
                  price_currency: true,
                  price_amount: true,
                },
              },
              amount: true,
              measurement: true,
              recipe_text: true,
            },
          },
        },
        cursor: {
          id: parseInt(cursor, 10),
        },
        take,
      },
    );

    performanceTest.end('get paginate recipes');

    logger.info('recipes found', results);
    return results.map((result) => recipeMapper.toDto(result));
  };

  get = async (recipe: Partial<Recipe>): Promise<Recipe[] | undefined> => {
    logger.info('get recipe repository request', recipe);
    performanceTest.start('get recipes');
    const results = await this.prisma.recipes.findMany(
      {
        where: {
          OR: [{
            ...recipe.id && { id: recipe.id },
          }, {
            ...recipe.name && { name: recipe.name },
          }, {
            ...recipe.link && { link: recipe.link },
          }],
          AND: [{
            ...recipe.prepTime && { prep_time: recipe.prepTime },
            ...recipe.servings && { servings: recipe.servings },
            ...recipe.numSaved && { num_saved: recipe.numSaved },
            ...recipe.ingredients && {
              ingredients: {
                some: {
                  ingredient_name: { in: recipe.ingredients.map((ingredient) => ingredient.name || '') },
                },
              },
            },
            ...recipe.cuisines && {
              cuisines: {
                equals: recipe.cuisines,
              },
            },
            ...recipe.allergies && {
              allergies: {
                equals: recipe.allergies,
              },
            },
            ...recipe.diets && {
              diets: {
                equals: recipe.diets,
              },
            },
          }],
        },
        include: {
          ingredients: {
            select: {
              ingredient: {
                select: {
                  name: true,
                  price_currency: true,
                  price_amount: true,
                },
              },
              amount: true,
              measurement: true,
              recipe_text: true,
            },
          },
        },
      },
    );

    performanceTest.end('get recipes');

    logger.info('recipes found', results);
    return results.map((result) => recipeMapper.toDto(result));
  };

  getOne = async (recipe: Partial<Recipe>): Promise<Recipe | undefined> => {
    logger.info('get one ingredient repository request', recipe);
    performanceTest.start('get one recipe');

    const result = await this.prisma.recipes.findOne(
      {
        where: {
          id: recipe.id,
          link: recipe.link,
        },
        include: {
          ingredients: {
            select: {
              ingredient: {
                select: {
                  name: true,
                  price_currency: true,
                  price_amount: true,
                },
              },
              amount: true,
              measurement: true,
              recipe_text: true,
            },
          },
        },
      },
    );

    performanceTest.end('get one recipe');
    if (result === null) {
      return undefined;
    }

    logger.info('recipe found', result);
    return recipeMapper.toDto(result);
  };

  private readonly upsert = async (recipe: PartialBy<Recipe, 'id'>, override = false): Promise<Recipe> => {
    const overrideOrUpdate = (
      shouldUpdate: boolean, value: Record<string, unknown>,
    ) => (override ? value : shouldUpdate && value);

    logger.info('upsert ingredient repository request', recipe);

    if (recipe.ingredients) {
      logger.info('verifying if ingredients exist in database...');
      await Promise.all(recipe.ingredients.map(async (ingredient) => {
        if (!ingredient.name) {
          logger.info('ingredient name is null, no need to do anything yet...');
          return;
        }

        const doesIngredientExist = await this.ingredientsService.get({ name: ingredient.name });

        if (!doesIngredientExist) {
          logger.info('ingredient does not exist, attempting to save it...');

          await this.ingredientsService.save({
            name: ingredient.name,
            price: {
              currency: ingredient.price?.currency || 'NZD',
              amount: ingredient.price?.amount || 0,
            },
          });

          logger.info('ingredient saved.');
        }
      }));
    }

    logger.info('saving recipes...');

    const result = await this.prisma.recipes.upsert({
      create: {
        name: recipe.name,
        prep_time: recipe.prepTime,
        servings: recipe.servings,
        link: recipe.link,
        num_saved: 0,
        ingredients: {
          create: recipe.ingredients.map((ingredient) => ({
            amount: ingredient.amount,
            measurement: ingredient.measurement,
            recipe_text: ingredient.text,
            ...!!ingredient.name && {
              ingredient: {
                connect: {
                  name: ingredient.name,
                },
              },
            },
          })),
        },
        allergies: {
          set: recipe.allergies || [],
        },
        cuisines: {
          set: recipe.cuisines || [],
        },
        diets: {
          set: recipe.diets || [],
        },
        adjectives: {
          set: recipe.adjectives || [],
        },
        meals: {
          set: recipe.meals || [],
        },
      },
      update: {
        ...overrideOrUpdate(!!recipe.name, { name: recipe.name }),
        ...overrideOrUpdate(!!recipe.prepTime, { prep_time: recipe.prepTime }),
        ...overrideOrUpdate(recipe.servings !== undefined, { servings: recipe.servings }),
        ...overrideOrUpdate(!!recipe.link, { link: recipe.link }),
        ...overrideOrUpdate(recipe.numSaved !== undefined, { num_saved: recipe.numSaved }),
        ...overrideOrUpdate(recipe.ingredients && Object.keys(recipe.ingredients).length > 0, {
          ingredients: {
            upsert: recipe.ingredients.map((ingredient) => ({
              create: {
                amount: ingredient.amount,
                measurement: ingredient.measurement,
                recipe_text: ingredient.text,
                ...ingredient.name && {
                  ingredient: {
                    connect: {
                      name: ingredient.name,
                    },
                  },
                },
              },
              update: {
                amount: ingredient.amount,
                measurement: ingredient.measurement,
                recipe_text: ingredient.text,
                ...ingredient.name && {
                  ingredient: {
                    connect: {
                      name: ingredient.name,
                    },
                  },
                },
              },
              where: {
                recipe_link_recipe_text: {
                  recipe_text: ingredient.text,
                  recipe_link: recipe.link,
                },
              },
            })),
          },
        }),
        ...overrideOrUpdate(recipe.allergies?.length > 0, {
          allergies: {
            set: recipe.allergies,
          },
        }),
        ...overrideOrUpdate(recipe.cuisines?.length > 0, {
          cuisines: {
            set: recipe.cuisines,
          },
        }),
        ...overrideOrUpdate(recipe.diets?.length > 0, {
          diets: {
            set: recipe.diets,
          },
        }),
        ...overrideOrUpdate(recipe.adjectives?.length > 0, {
          adjectives: {
            set: recipe.adjectives,
          },
        }),
        ...overrideOrUpdate(recipe.meals?.length > 0, {
          meals: {
            set: recipe.meals,
          },
        }),
      },
      where: {
        id: recipe.id,
        link: recipe.link,
      },
      include: {
        ingredients: {
          select: {
            ingredient: {
              select: {
                name: true,
                price_currency: true,
                price_amount: true,
              },
            },
            amount: true,
            measurement: true,
            recipe_text: true,
          },
        },
      },
    });

    logger.info('upserted recipe', result);

    return recipeMapper.toDto(result);
  };

  async save(recipesDto: PartialBy<Recipe, 'id'>, options?: SaveOptions): Promise<Recipe>;

  async save(recipesDto: PartialBy<Recipe, 'id'>[], options?: SaveOptions): Promise<Recipe[]>;

  async save(recipesDto: PartialBy<Recipe, 'id'> | PartialBy<Recipe, 'id'>[], options?: SaveOptions):
  Promise<Recipe | Recipe[]> {
    if (Array.isArray(recipesDto)) {
      performanceTest.start('save recipes');
      // As of now, Prisma 2 does not support createMany. For now, given the low amount
      // of recipes being created per day, the number of Promises being created is fine.
      // If this becomes a bottleneck, we will have to use raw SQL under the hood.

      // See https://github.com/prisma/prisma-client-js/issues/332 for progress on this.
      const results = await Promise.all(
        recipesDto.map(async (recipe) => this.upsert(recipe, !!options?.override)),
      );

      performanceTest.end('save recipes');
      return results;
    }

    performanceTest.start('save recipe');
    const result = this.upsert(recipesDto, !!options?.override);

    performanceTest.end('save recipe');
    return result;
  }

  async delete(ids: string): Promise<Recipe>;

  async delete(ids: string[]): Promise<Recipe[]>;

  async delete(ids: string | string[]): Promise<Recipe | Recipe[]> {
    logger.info('delete ingredient repository request', ids);

    if (Array.isArray(ids)) {
      performanceTest.start('delete recipes');
      const results = await Promise.all(ids.map(async (id) => {
        if (isNaN(Number(id))) {
          throw new AppError({ message: 'Given recipe ID is not a number.', isOperational: true, httpStatus: 500 });
        }

        const result = await this.prisma.recipes.delete({
          where: {
            id: Number(id),
          },
          include: {
            ingredients: {
              select: {
                ingredient: {
                  select: {
                    name: true,
                    price_currency: true,
                    price_amount: true,
                  },
                },
                amount: true,
                measurement: true,
                recipe_text: true,
              },
            },
          },
        });

        return recipeMapper.toDto(result);
      }));

      performanceTest.end('delete recipes');
      return results;
    }

    if (isNaN(Number(ids))) {
      throw new AppError({ message: 'Given recipe ID is not a number.', isOperational: true, httpStatus: 500 });
    }

    performanceTest.start('delete recipe');
    const result = await this.prisma.recipes.delete({
      where: {
        id: Number(ids),
      },
      include: {
        ingredients: {
          select: {
            ingredient: {
              select: {
                name: true,
                price_currency: true,
                price_amount: true,
              },
            },
            amount: true,
            measurement: true,
            recipe_text: true,
          },
        },
      },
    });

    performanceTest.end('delete recipe');
    logger.info('deleted recipe', result);
    return recipeMapper.toDto(result);
  }
}
