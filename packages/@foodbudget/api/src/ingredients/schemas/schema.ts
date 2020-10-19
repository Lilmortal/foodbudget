import { floatArg, queryField, stringArg } from '@nexus/schema';
import { Context } from '../../context';
import { Ingredient } from '../Ingredient.types';
import { ingredientField } from './schemaFields';

// eslint-disable-next-line import/prefer-default-export
export const getIngredients = queryField('ingredients', {
  type: ingredientField,
  list: true,
  args: {
    name: stringArg(),
    currency: stringArg(),
    amount: floatArg(),
  },
  async resolve(_parent, args, ctx: Context) {
    const ingredients: Partial<Ingredient> = {
      name: args.name,
      price: {
        currency: args.currency,
        amount: args.amount,
      },
    };
    const result = await ctx.serviceManager.ingredientServices.get(ingredients);
    return result;
  },
});
