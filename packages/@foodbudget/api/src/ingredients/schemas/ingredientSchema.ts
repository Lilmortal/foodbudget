import logger from '@foodbudget/logger';
import { floatArg, queryField, stringArg } from '@nexus/schema';
import { CacheScope } from 'apollo-cache-control';
import { Context } from '../../context';
import { Ingredient } from '../Ingredient.types';
import { ingredientField } from './ingredientSchemaFields';

// eslint-disable-next-line import/prefer-default-export
export const getIngredients = queryField('ingredients', {
  type: ingredientField,
  list: true,
  args: {
    name: stringArg(),
    currency: stringArg(),
    amount: floatArg(),
  },
  async resolve(_parent, args, ctx: Context, info) {
    logger.info('incoming get ingredient request', args);
    info.cacheControl.setCacheHint({ maxAge: 86400, scope: CacheScope.Public });

    const ingredients: Partial<Ingredient> = {
      name: args.name,
      price: {
        currency: args.currency,
        amount: args.amount,
      },
    };
    const result = await ctx.serviceManager.ingredientServices.get(ingredients);
    logger.info('get ingredient response', result);
    return result;
  },
});
