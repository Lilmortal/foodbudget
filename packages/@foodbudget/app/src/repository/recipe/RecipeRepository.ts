import { PrismaClient } from '@prisma/client';
import Repository from '../Repository.types';
import { Recipe } from './Recipe.types';

export default class RecipeRepository implements Repository<Recipe> {
  readonly #prisma: PrismaClient;

  constructor(prisma: PrismaClient) {
    this.#prisma = prisma;
  }

  async create(recipes: Recipe | Recipe[]): Promise<void> {
    if (Array.isArray(recipes)) {
      // As of now, Prisma 2 does not support createMany. For now, given the low amount
      // of recipes being created per day, the number of Promises being created is fine.
      // If this becomes a bottleneck, we will have to use raw SQL under the hood.

      // See https://github.com/prisma/prisma-client-js/issues/332 for progress on this.
      await Promise.all(
        recipes.map(async (recipe) => {
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
          recipe_name: recipes.name,
          prep_time: recipes.prepTime,
          servings: recipes.servings,
          link: recipes.link,
          num_saved: 0,
        },
      });
    }
  }
}
