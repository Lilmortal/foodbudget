import logger from '@foodbudget/logger';
import { mutationField, stringArg, intArg, arg } from '@nexus/schema';
import { Context } from '../../../context';
import { Recipe } from '../../Recipe.types';
import {
  adjectiveType,
  allergyType,
  cuisineType,
  dietType,
  mealType,
  recipeField,
  recipeIngredientArg,
} from '../recipeFields';

export const saveRecipe = mutationField('saveRecipe', {
  type: recipeField,
  args: {
    name: stringArg({ required: true }),
    link: stringArg(),
    prepTime: stringArg(),
    servings: intArg(),
    numSaved: intArg(),
    ingredients: arg({ type: recipeIngredientArg, list: true }),
    cuisines: arg({ type: cuisineType, list: true }),
    allergies: arg({ type: allergyType, list: true }),
    diets: arg({ type: dietType, list: true }),
    adjectives: arg({ type: adjectiveType, list: true }),
    meals: arg({ type: mealType, list: true }),
  },
  async resolve(_parent, args, ctx: Context) {
    // if (!ctx.scope?.includes('ADMIN')) {
    //   throw new AppError({ message: 'Forbidden request', isOperational: true, httpStatus: 403 });
    // }
    logger.info('save recipe request', args);

    const recipe: Omit<Recipe, 'id'> = {
      name: args.name,
      link: args.link,
      prepTime: args.prepTime,
      servings: args.servings,
      numSaved: args.numSaved,
      ingredients: args.ingredients,
      cuisines: args.cuisines,
      allergies: args.allergies,
      diets: args.diets,
      adjectives: args.adjectives,
      meals: args.meals,
    };

    const result = await ctx.serviceManager.recipeServices.save(recipe);

    logger.info('saved recipe response', recipe);
    return result;
  },
});
