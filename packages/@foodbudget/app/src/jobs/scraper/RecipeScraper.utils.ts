import { Recipe } from "../../repository/recipe";
import { ScraperError } from "./ScraperError";

export const validate = (
  pageInfo: Record<
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

  if (pageInfo.prepTime && !Array.isArray(pageInfo.prepTime)) {
    validatedPageInfo.prepTime = pageInfo.prepTime;
  } else {
    emptyResults.push("prepTime must be a non-empty string.");
  }

  if (
    pageInfo.servings &&
    !Array.isArray(pageInfo.servings) &&
    !isNaN(parseInt(pageInfo.servings))
  ) {
    validatedPageInfo.servings = parseInt(pageInfo.servings);
  } else {
    emptyResults.push("servings must be a non-empty number.");
  }

  if (pageInfo.name && !Array.isArray(pageInfo.name)) {
    validatedPageInfo.name = pageInfo.name;
  } else {
    emptyResults.push("name must be a non-empty string.");
  }

  if (pageInfo.ingredients && Array.isArray(pageInfo.ingredients)) {
    validatedPageInfo.ingredients = pageInfo.ingredients;
  } else {
    emptyResults.push("ingredients must be a non-empty string.");
  }

  if (emptyResults.length > 0) {
    throw new ScraperError(emptyResults.join("\n"));
  }

  return validatedPageInfo;
};
