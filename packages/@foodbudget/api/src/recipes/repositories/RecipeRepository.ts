import { PrismaClient, recipes } from '@prisma/client';
import { Repository } from '../../shared/types/Repository.types';
import { Recipe } from '../Recipe.types';

export default class RecipeRepository implements Repository<Recipe, recipes> {
  private readonly prisma: PrismaClient;

  constructor(prisma: PrismaClient) {
    this.prisma = prisma;
  }

  async getMany(recipe: Partial<Recipe>): Promise<recipes[] | undefined> {
    return this.prisma.recipes.findMany(
      {
        where: {
          OR: [{
            recipe_ingredients: {
              some: {
                ingredient_name: {
                  in: recipe.ingredients,
                },
              },
            },
            recipe_name: recipe.name,
            recipe_cuisines: {
              some: {
                cuisine_type: {
                  in: recipe.cuisines,
                },
              },
            },
            recipe_allergies: {
              some: {
                allergy_type: {
                  in: recipe.allergies,
                },
              },
            },
            recipe_diets: {
              some: {
                diet_type: {
                  in: recipe.diets,
                },
              },
            },
          }],
        },
        include: {
          recipe_cuisines: true,
          recipe_diets: true,
          recipe_ingredients: true,
          recipe_allergies: true,
          recipe_adjectives: true,
        },
      },
    ) || [];
  }

  // eslint-disable-next-line class-methods-use-this, @typescript-eslint/no-unused-vars
  async getOne(recipesEntity: Partial<Recipe>): Promise<recipes | undefined> {
    const result = await this.prisma.recipes.findOne({
      where: recipesEntity,
      include: {
        recipe_cuisines: true,
        recipe_diets: true,
        recipe_ingredients: true,
        recipe_allergies: true,
        recipe_adjectives: true,
      },
    });

    if (result === null) {
      return undefined;
    }

    return result;
  }

  async create(recipesDto: Recipe): Promise<recipes>;

  async create(recipesDto: Recipe[]): Promise<recipes[]>;

  async create(recipesDto: Recipe | Recipe[]): Promise<recipes | recipes[]> {
    if (Array.isArray(recipesDto)) {
      // As of now, Prisma 2 does not support createMany. For now, given the low amount
      // of recipes being created per day, the number of Promises being created is fine.
      // If this becomes a bottleneck, we will have to use raw SQL under the hood.

      // See https://github.com/prisma/prisma-client-js/issues/332 for progress on this.
      return Promise.all(
        recipesDto.map(async (recipe) => this.prisma.recipes.create({
          data: {
            recipe_name: recipe.name,
            prep_time: recipe.prepTime,
            servings: recipe.servings,
            link: recipe.link,
            num_saved: 0,
            recipe_ingredients: {
              create: recipe.ingredients.map((ingredient) => ({
                quantity: 0,
                ingredients: {
                  create: {
                    ingredient_name: ingredient,
                    price: 0,
                  },
                },
              })),
            },
            recipe_allergies: {
              create: recipe.allergies.map((allergy) => ({
                allergies: {
                  create: {
                    allergy_type: allergy,
                  },
                },
              })),
            },
          },
        })),
      );
    }
    return this.prisma.recipes.create({
      data: {
        recipe_name: recipesDto.name,
        prep_time: recipesDto.prepTime,
        servings: recipesDto.servings,
        link: recipesDto.link,
        num_saved: 0,
      },
    });
  }

  async update(recipesDto: Partial<Recipe>): Promise<recipes>;

  async update(recipesDto: Partial<Recipe>[]): Promise<recipes[]>;

  async update(recipesDto: Partial<Recipe> | (Partial<Recipe>)[]): Promise<recipes | recipes[]> {
    if (Array.isArray(recipesDto)) {
      return Promise.all(recipesDto.map(async (recipe) => this.prisma.recipes.update({
        data: recipe,
        where: {
          link: recipe.link,
        },
      })));
    }

    return this.prisma.recipes.update({
      data: recipesDto,
      where: {
        link: recipesDto.link,
      },
    });
  }

  async delete(ids: number): Promise<recipes>;

  async delete(ids: number[]): Promise<recipes[]>;

  async delete(ids: number | number[]): Promise<recipes | recipes[]> {
    if (Array.isArray(ids)) {
      return Promise.all(ids.map(async (id) => this.prisma.recipes.delete({
        where: {
          id,
        },
      })));
    }

    return this.prisma.recipes.delete({
      where: {
        id: ids,
      },
    });
  }
}
