import { Recipe } from "../../repository/recipe";
import { ScraperError } from "./ScraperError";

export const validate = (
  recipePageInfo: Record<
    keyof Pick<Recipe, "prepTime" | "servings" | "name" | "ingredients">,
    string | string[]
  >
): Pick<Recipe, "prepTime" | "servings" | "name" | "ingredients"> => {
  const emptyResults = [];

  const validatedPageInfo: Pick<
    Recipe,
    "prepTime" | "servings" | "name" | "ingredients"
  > = {
    prepTime: "",
    servings: 0,
    name: "",
    ingredients: [],
  };

  if (recipePageInfo.prepTime && !Array.isArray(recipePageInfo.prepTime)) {
    validatedPageInfo.prepTime = recipePageInfo.prepTime;
  } else {
    emptyResults.push("prepTime must be a non-empty string.");
  }

  if (
    recipePageInfo.servings &&
    !Array.isArray(recipePageInfo.servings) &&
    !isNaN(Number(recipePageInfo.servings))
  ) {
    validatedPageInfo.servings = Number(recipePageInfo.servings);
  } else {
    emptyResults.push("servings must be a non-empty number.");
  }

  if (recipePageInfo.name && !Array.isArray(recipePageInfo.name)) {
    validatedPageInfo.name = recipePageInfo.name;
  } else {
    emptyResults.push("name must be a non-empty string.");
  }

  if (
    recipePageInfo.ingredients &&
    Array.isArray(recipePageInfo.ingredients) &&
    recipePageInfo.ingredients.length > 0
  ) {
    validatedPageInfo.ingredients = recipePageInfo.ingredients;
  } else {
    emptyResults.push("ingredients must be a non-empty array.");
  }

  if (emptyResults.length > 0) {
    throw new ScraperError(emptyResults.join("\n"));
  }

  return validatedPageInfo;
};
