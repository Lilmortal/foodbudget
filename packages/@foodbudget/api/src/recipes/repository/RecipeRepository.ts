import { PrismaClient, recipes } from '@prisma/client';
import { Repository } from '../../types/Repository.types';
import { Recipe } from './Recipe.types';

export default class RecipeRepository implements Repository<Recipe, recipes> {
  readonly #prisma: PrismaClient;

  constructor(prisma: PrismaClient) {
    this.#prisma = prisma;
  }

  async get(recipe: Partial<Recipe>): Promise<recipes[] | undefined> {
    return this.#prisma.recipes.findMany(
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
    );
  }

  async create(recipesDTO: Recipe | Recipe[]): Promise<void> {
    if (Array.isArray(recipesDTO)) {
      // As of now, Prisma 2 does not support createMany. For now, given the low amount
      // of recipes being created per day, the number of Promises being created is fine.
      // If this becomes a bottleneck, we will have to use raw SQL under the hood.

      // See https://github.com/prisma/prisma-client-js/issues/332 for progress on this.
      await Promise.all(
        recipesDTO.map(async (recipe) => {
          await this.#prisma.recipes.create({
            data: {
              recipe_name: recipe.name,
              prep_time: recipe.prepTime,
              servings: recipe.servings,
              link: recipe.link,
              num_saved: 0,
            },
          });
        }),
      );
    } else {
      await this.#prisma.recipes.create({
        data: {
          recipe_name: recipesDTO.name,
          prep_time: recipesDTO.prepTime,
          servings: recipesDTO.servings,
          link: recipesDTO.link,
          num_saved: 0,
        },
      });
    }
  }
}
