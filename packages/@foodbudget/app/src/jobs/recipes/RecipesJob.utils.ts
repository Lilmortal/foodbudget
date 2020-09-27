import { Recipe } from "../../repository/recipe";
import { ScrapeError } from "../scraper";
import { ScrapedRecipe } from "./RecipesJob.types";

export interface ValidatedScrapedRecipe
  extends Pick<
    Recipe,
    "prepTime" | "servings" | "name" | "ingredients" | "link"
  > {}

export function validate(scrapedRecipe: ScrapedRecipe): ValidatedScrapedRecipe;
export function validate(
  scrapedRecipe: ScrapedRecipe[]
): ValidatedScrapedRecipe[];
export function validate(
  scrapedRecipe: ScrapedRecipe | ScrapedRecipe[]
): ValidatedScrapedRecipe | ValidatedScrapedRecipe[];
export function validate(
  scrapedRecipe: ScrapedRecipe | ScrapedRecipe[]
): ValidatedScrapedRecipe | ValidatedScrapedRecipe[] {
  if (Array.isArray(scrapedRecipe)) {
    return scrapedRecipe.map((recipe) => validate(recipe));
  }
  const emptyResults = [];

  const validatedPageInfo: ValidatedScrapedRecipe = {
    prepTime: "",
    servings: 0,
    name: "",
    ingredients: [],
    link: "",
  };

  if (scrapedRecipe.link && !Array.isArray(scrapedRecipe.link)) {
    validatedPageInfo.link = scrapedRecipe.link;
  }

  if (scrapedRecipe.prepTime && !Array.isArray(scrapedRecipe.prepTime)) {
    validatedPageInfo.prepTime = scrapedRecipe.prepTime;
  } else {
    emptyResults.push("prepTime must be a non-empty string.");
  }

  if (
    scrapedRecipe.servings &&
    !Array.isArray(scrapedRecipe.servings) &&
    !isNaN(Number(scrapedRecipe.servings))
  ) {
    validatedPageInfo.servings = Number(scrapedRecipe.servings);
  } else {
    emptyResults.push("servings must be a non-empty number.");
  }

  if (scrapedRecipe.name && !Array.isArray(scrapedRecipe.name)) {
    validatedPageInfo.name = scrapedRecipe.name;
  } else {
    emptyResults.push("name must be a non-empty string.");
  }

  if (
    scrapedRecipe.ingredients &&
    Array.isArray(scrapedRecipe.ingredients) &&
    scrapedRecipe.ingredients.length > 0
  ) {
    validatedPageInfo.ingredients = scrapedRecipe.ingredients;
  } else {
    emptyResults.push("ingredients must be a non-empty array.");
  }

  if (emptyResults.length > 0) {
    throw new ScrapeError(emptyResults.join("\n"));
  }

  return validatedPageInfo;
}
