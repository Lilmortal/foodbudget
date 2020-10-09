import { queryField, stringArg } from '@nexus/schema';
import { Context } from '../../types/ApolloServer.types';
import { Recipe } from '../repository';

const getRecipes = queryField('recipes', {
  type: 'recipes',
  args: {
    name: stringArg(),
    ingredients: stringArg({ list: true }),
    allergies: stringArg({ list: true }),
    cuisines: stringArg({ list: true }),
    diets: stringArg({ list: true }),
  },
  resolve(_parent, args, ctx: Context) {
    const recipe: Partial<Recipe> = {
      name: args.name,
      ingredients: args.ingredients,
      allergies: args.allergies,
      cuisines: args.cuisines,
      diets: args.diets,
    };
    return ctx.serviceManager.recipeServices.get(recipe);
  },
});

export default getRecipes;
