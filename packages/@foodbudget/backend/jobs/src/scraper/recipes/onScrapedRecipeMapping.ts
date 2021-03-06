import { Recipe } from '@foodbudget/api';
import { AppError } from '@foodbudget/errors';
import { ScrapedRecipe } from './RecipesScraper.types';

export const onScrapedRecipeMapping = (
  scrapedRecipe: ScrapedRecipe,
): Omit<Recipe, 'id'> => {
  const validationErrors: string[] = [];

  const recipe: Omit<Recipe, 'id'> = {
    prepTime: '',
    servings: 0,
    name: '',
    numSaved: 0,
    ingredients: [],
    cuisines: [],
    diets: [],
    allergies: [],
    link: '',
    adjectives: [],
    meals: [],
  };

  if (scrapedRecipe.link && !Array.isArray(scrapedRecipe.link)) {
    recipe.link = scrapedRecipe.link;
  } else {
    validationErrors.push('link must be a non-empty string.');
  }

  if (scrapedRecipe.prepTime && !Array.isArray(scrapedRecipe.prepTime)) {
    recipe.prepTime = scrapedRecipe.prepTime;
  }

  if (
    scrapedRecipe.servings &&
    !Array.isArray(scrapedRecipe.servings) &&
    !isNaN(Number(scrapedRecipe.servings))
  ) {
    recipe.servings = Number(scrapedRecipe.servings);
  }

  if (scrapedRecipe.name && !Array.isArray(scrapedRecipe.name)) {
    recipe.name = scrapedRecipe.name;
  } else {
    validationErrors.push('name must be a non-empty string.');
  }

  if (
    scrapedRecipe.ingredients &&
    Array.isArray(scrapedRecipe.ingredients) &&
    scrapedRecipe.ingredients.length > 0
  ) {
    recipe.ingredients = scrapedRecipe.ingredients.map((ingredient) => ({
      text: ingredient,
      name: '',
      price: {
        currency: '',
        amount: 0,
      },
      amount: 0,
      measurement: '',
    }));
  } else {
    validationErrors.push('ingredients must be a non-empty array.');
  }

  if (validationErrors.length > 0) {
    throw new AppError({
      message: validationErrors.join('\n'),
      isOperational: true,
    });
  }

  return recipe;
};
