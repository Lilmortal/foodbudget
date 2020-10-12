import { mutationField, stringArg, intArg } from '@nexus/schema';
import { Context } from '../../../context';
import { Recipe } from '../../Recipe.types';

const saveRecipe = mutationField('recipes', {
  type: 'String',
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

    return ctx.serviceManager.recipeServices.save(recipe);
  },
});

export default saveRecipe;
