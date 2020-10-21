import { mutationField, stringArg, floatArg } from '@nexus/schema';
import { AppError } from '@foodbudget/errors';
import logger from '@foodbudget/logger';
import { Context } from '../../../context';
import { Ingredient } from '../../Ingredient.types';
import { ingredientField } from '../ingredientSchemaFields';

const validateArguments = (args: unknown):boolean => {
  if (typeof (args as Ingredient).name === 'string' && (args as Ingredient).name.length > 0) {
    return true;
  }
  throw new AppError({ message: 'Invalid ingredient argument.', isOperational: true });
};

const saveIngredient = mutationField('ingredients', {
  type: ingredientField,
  args: {
    name: stringArg({ required: true }),
    currency: stringArg(),
    amount: floatArg(),
  },
  async resolve(_parent, args, ctx: Context) {
    validateArguments(args);

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
