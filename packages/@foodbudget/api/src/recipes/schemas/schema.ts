import {
  arg, intArg, queryField, stringArg,
} from '@nexus/schema';
import { AppError } from '@foodbudget/errors';
import logger from '@foodbudget/logger';
import { Context } from '../../context';
import { Recipe } from '../Recipe.types';
import {
  adjectiveType, allergyType, cuisineType, dietType, mealType, recipeField, recipeIngredientArg,
} from './schemaFields';

const validateArguments = (args: unknown):boolean => {
  if (typeof (args as Recipe).name === 'string' && (args as Recipe).name.length > 0) {
    return true;
  }
  throw new AppError({ message: 'Invalid ingredient argument.', isOperational: true });
};

// eslint-disable-next-line import/prefer-default-export
export const getRecipes = queryField('recipes', {
  type: recipeField,
  list: true,
  args: {
    id: intArg(),
    link: stringArg(),
    prepTime: stringArg(),
    servings: intArg(),
    numSaved: intArg(),
    name: stringArg(),
    ingredients: arg({ type: recipeIngredientArg, list: true }),
    cuisines: arg({ type: cuisineType, list: true }),
    diets: arg({ type: dietType, list: true }),
    allergies: arg({ type: allergyType, list: true }),
    adjectives: arg({ type: adjectiveType, list: true }),
    meals: arg({ type: mealType, list: true }),
  },
  async resolve(_parent, args, ctx: Context) {
    validateArguments(args);

    logger.info('get recipes request', args);

    const recipe: Partial<Recipe> = {
      id: args.id,
      link: args.link,
      prepTime: args.prepTime,
      servings: args.servings,
      numSaved: args.numSaved,
      name: args.name,
      ingredients: args.ingredients,
      cuisines: args.cuisines,
      diets: args.diets,
      allergies: args.allergies,
      adjectives: args.adjectives,
      meals: args.meals,
    };
    const result = await ctx.serviceManager.recipeServices.get(recipe);

    logger.info('get recipes response', result);
    return result;
  },
});
