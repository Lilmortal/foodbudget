import { Recipe } from '@foodbudget/api';
import { ScrapeError } from '@foodbudget/errors';
import Scraper from '../Scraper';
import { OnScrape } from '../Scraper.types';
import { ScrapedRecipe } from './RecipesScraper.types';

export const onMapping = (scrapedRecipe: ScrapedRecipe): Recipe => {
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

  if (scrapedRecipe.link && !Array.isArray(scrapedRecipe.link)) {
    recipe.link = scrapedRecipe.link;
  } else {
    validationErrors.push('link must be a non-empty string.');
  }

  if (scrapedRecipe.prepTime && !Array.isArray(scrapedRecipe.prepTime)) {
    recipe.prepTime = scrapedRecipe.prepTime;
  } else {
    validationErrors.push('prepTime must be a non-empty string.');
  }

  if (
    scrapedRecipe.servings && !Array.isArray(scrapedRecipe.servings) && !isNaN(Number(scrapedRecipe.servings))
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
    throw new ScrapeError(validationErrors.join('\n'));
  }

  return recipe;
};

export default class RecipesScraper<S extends ScrapedRecipe> extends Scraper<S, Recipe> {
  constructor(onScrape: OnScrape<S>) {
    super({ onScrape, onMapping });
  }
}
