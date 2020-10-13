import { PrismaClient, recipes } from '@prisma/client';
import { Repository } from '../../shared/types/Repository.types';
import { Recipe } from '../Recipe.types';

export default class RecipeRepository implements Repository<recipes> {
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
      },
    ) || [];
  }

  // eslint-disable-next-line class-methods-use-this, @typescript-eslint/no-unused-vars
  async getOne(recipe: Partial<Recipe>): Promise<recipes | undefined> {
    return undefined;
  }

  async create(recipesEntity: recipes): Promise<recipes>;

  async create(recipesEntity: recipes[]): Promise<recipes[]>;

  async create(recipesEntity: recipes | recipes[]): Promise<recipes | recipes[]> {
    if (Array.isArray(recipesEntity)) {
      // As of now, Prisma 2 does not support createMany. For now, given the low amount
      // of recipes being created per day, the number of Promises being created is fine.
      // If this becomes a bottleneck, we will have to use raw SQL under the hood.

      // See https://github.com/prisma/prisma-client-js/issues/332 for progress on this.
      return Promise.all(
        recipesEntity.map(async (recipe) => this.prisma.recipes.create({
          data: {
            recipe_name: recipe.recipe_name,
            prep_time: recipe.prep_time,
            servings: recipe.servings,
            link: recipe.link,
            num_saved: 0,
          },
        })),
      );
    }
    return this.prisma.recipes.create({
      data: {
        recipe_name: recipesEntity.recipe_name,
        prep_time: recipesEntity.prep_time,
        servings: recipesEntity.servings,
        link: recipesEntity.link,
        num_saved: 0,
      },
    });
  }
}
