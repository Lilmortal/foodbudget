import { Repository } from "../types";
import { Recipe } from "./recipe.types";
import { PrismaClient } from "@prisma/client";

export class RecipeRepository implements Repository<Recipe> {
  #prisma: PrismaClient;

  constructor(prisma: PrismaClient) {
    this.#prisma = prisma;
  }

  async create(recipe: Recipe) {
    await this.#prisma.recipes.create({
      data: {
        recipe_name: recipe.name,
        prep_time: recipe.prepTime,
        servings: recipe.servings,
        link: recipe.link,
        num_saved: 0,
      },
    });
  }
}
