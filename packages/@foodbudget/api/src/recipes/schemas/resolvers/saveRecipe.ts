import { mutationField, stringArg, intArg } from '@nexus/schema';
import { recipes } from '@prisma/client';
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
    // const recipe: recipes = {
    //   recipe_name: args.name,
    //   link: args.link,
    //   prep_time: args.prepTime,
    //   servings: args.servings,
    //   // ingredients: args.ingredients,
    // };

    return undefined;

    // return ctx.serviceManager.recipeServices.save(recipe);
  },
});

export default saveRecipe;
