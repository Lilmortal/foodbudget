import { Repository } from "../types";
import { Recipe } from "./recipe.types";
import { PrismaClient, recipes } from "@prisma/client";
import { RecipeCreateFailedError } from "../libs/errors";

export class RecipeRepository implements Repository<Recipe> {
  #prisma: PrismaClient;

  constructor(prisma: PrismaClient) {
    this.#prisma = prisma;
  }

  async create(recipe: Recipe) {
    try {
      await this.#prisma.recipes.create({
        data: {
          recipe_name: recipe.name,
          prep_time: recipe.prepTime,
          servings: recipe.servings,
          link: recipe.link,
          num_saved: 0,
        },
      });
    } catch (err) {
      throw new RecipeCreateFailedError(err);
    }
  }
}
