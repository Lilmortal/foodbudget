import { Recipe } from '@foodbudget/app';
import Scraper from '../Scraper';
import { OnScrape } from '../Scraper.types';
import { ScrapedRecipe } from './RecipesScraper.types';

export const mapping = (scrapedRecipe: ScrapedRecipe): Recipe => {
  const validationErrors = [];

  const recipe: Recipe = {
    prepTime: '',
    servings: 0,
    name: '',
    ingredients: [],
    cuisines: [],
    diets: [],
    allergies: [],
    link: '',
  };

  if (scrapedRecipe.prepTime && !Array.isArray(scrapedRecipe.prepTime)) {
    recipe.prepTime = scrapedRecipe.prepTime;
  } else {
    validationErrors.push('prepTime must be a non-empty string.');
  }

  if (
    scrapedRecipe.servings && !isNaN(Number(scrapedRecipe.servings))
  ) {
    recipe.servings = Number(scrapedRecipe.servings);
  } else {
    validationErrors.push('servings must be a non-empty number.');
  }

  if (scrapedRecipe.name && !Array.isArray(scrapedRecipe.name)) {
    recipe.name = scrapedRecipe.name;
  } else {
    validationErrors.push('name must be a non-empty string.');
  }

  if (
    scrapedRecipe.ingredients
    && Array.isArray(scrapedRecipe.ingredients)
    && scrapedRecipe.ingredients.length > 0
  ) {
    recipe.ingredients = scrapedRecipe.ingredients;
  } else {
    validationErrors.push('ingredients must be a non-empty array.');
  }

  if (validationErrors.length > 0) {
    throw new Error(validationErrors.join('\n'));
  }

  return recipe;
};

export default class RecipesScraper<S extends ScrapedRecipe> extends Scraper<S, Recipe> {
  constructor(onScrape: OnScrape<S>) {
    super({ onScrape, mapping });
  }
}
