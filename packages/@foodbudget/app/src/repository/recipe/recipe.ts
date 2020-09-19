import { Repository } from "../types";
import { Recipe, RecipeRepository } from "./recipe.types";
import { PrismaClient } from "@prisma/client";

export const createRecipeRepository = (
  prisma: PrismaClient
): RecipeRepository => {
  return {
    create: async (recipe: Recipe) => {
      try {
        await prisma.recipes.create({
          data: {
            recipe_name: recipe.name,
            prep_time: recipe.prepTime,
            servings: recipe.servings,
            link: recipe.link,
            num_saved: 0,
          },
        });
      } catch (err) {
        throw new Error(err);
      }
      return true;
    },
  };
};
