import {
  arg, intArg, queryField, stringArg,
} from '@nexus/schema';
import logger from '@foodbudget/logger';
import { CacheScope } from 'apollo-cache-control';
import { Context } from '../../context';
import { Recipe } from '../Recipe.types';
import {
  adjectiveType, allergyType, cuisineType, dietType, mealType, recipeField, recipeIngredientArg,
} from './recipeSchemaFields';

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
  async resolve(_parent, args, ctx: Context, info) {
    logger.info('incoming get recipes request', args);

    info.cacheControl.setCacheHint({ maxAge: 86400, scope: CacheScope.Public });

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

export const getRecipesById = queryField('recipesById', {
  type: recipeField,
  args: {
    link: stringArg({ required: true }),
  },
  async resolve(_parent, args, ctx: Context, info) {
    logger.info('incoming get recipes by link request', args);

    info.cacheControl.setCacheHint({ maxAge: 86400, scope: CacheScope.Public });

    const recipe: Partial<Recipe> = {
      link: args.link,
    };

    const result = await ctx.serviceManager.recipeServices.get(recipe);

    logger.info('get recipes by link response', result);
    return result;
  },
});

export const getRecipesByLink = queryField('recipesByLink', {
  type: recipeField,
  args: {
    id: intArg({ required: true }),
  },
  async resolve(_parent, args, ctx: Context, info) {
    logger.info('incoming get recipes by id request', args);

    info.cacheControl.setCacheHint({ maxAge: 86400, scope: CacheScope.Public });

    const recipe: Partial<Recipe> = {
      id: args.id,
    };

    const result = await ctx.serviceManager.recipeServices.get(recipe);

    logger.info('get recipes by id response', result);
    return result;
  },
});
