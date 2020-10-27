import {
  mutationField, floatArg, arg, stringArg,
} from '@nexus/schema';
import logger from '@foodbudget/logger';
import { Context } from '../../../context';
import { Ingredient } from '../../Ingredient.types';
import { currencyType, ingredientField } from '../ingredientSchemaFields';

const saveIngredient = mutationField('ingredients', {
  type: ingredientField,
  args: {
    name: stringArg({ required: true }),
    currency: arg({ type: currencyType }),
    amount: floatArg(),
  },
  async resolve(_parent, args, ctx: Context) {
    logger.info('save ingredient request', args);

    const ingredient: Ingredient = {
      name: args.name,
      price: {
        currency: args.currency,
        amount: args.amount,
      },
    };

    const result = ctx.serviceManager.ingredientServices.save(ingredient);

    logger.info('saved ingredient response', result);
    return result;
  },
});

export default saveIngredient;
