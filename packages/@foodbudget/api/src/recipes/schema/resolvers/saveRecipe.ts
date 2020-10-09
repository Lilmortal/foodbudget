import { mutationField, stringArg, intArg } from '@nexus/schema';
import { Context } from '../../../types/ApolloServer.types';
import { Recipe } from '../../repository';

const saveRecipe = mutationField('recipes', {
  type: 'recipes',
  args: {
    name: stringArg({ required: true }),
    link: stringArg({ required: true }),
    prepTime: stringArg({ required: true }),
    servings: intArg({ required: true }),
    ingredients: stringArg({ required: true, list: true }),
  },
  async resolve(_parent, args, ctx: Context) {
    const recipe: Recipe = {
      name: args.name,
      link: args.link,
      prepTime: args.prepTime,
      servings: args.servings,
      ingredients: args.ingredients,
      allergies: [],
      diets: [],
      cuisines: [],
    };

    let result;
    try {
      result = await ctx.serviceManager.recipeServices.save(recipe);
    } catch (err) {
      console.log(err);
      throw new Error(err);
    }

    return result;
  },
});

export default saveRecipe;
