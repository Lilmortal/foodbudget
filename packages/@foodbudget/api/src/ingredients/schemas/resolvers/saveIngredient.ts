import { mutationField, stringArg, floatArg } from '@nexus/schema';
import { Context } from '../../../context';
import { Ingredient } from '../../Ingredient.types';
import { ingredientField } from '../schemaFields';

const saveIngredient = mutationField('ingredients', {
  type: ingredientField,
  args: {
    name: stringArg({ required: true }),
    currency: stringArg(),
    amount: floatArg(),
  },
  async resolve(_parent, args, ctx: Context) {
    const ingredient: Ingredient = {
      name: args.name,
      price: {
        currency: args.currency,
        amount: args.amount,
      },
    };

    return ctx.serviceManager.ingredientServices.save(ingredient);
  },
});

export default saveIngredient;
