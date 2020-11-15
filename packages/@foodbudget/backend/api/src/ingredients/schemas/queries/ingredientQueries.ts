import { AppError } from '@foodbudget/errors';
import logger from '@foodbudget/logger';
import {
  arg, floatArg, idArg, intArg, objectType, queryField, stringArg,
} from '@nexus/schema';
import { CacheScope } from 'apollo-cache-control';
import { Context } from '../../../context';
import { Ingredient } from '../../Ingredient.types';
import { currencyType, ingredientConnection, ingredientField } from '../ingredientFields';

export const ingredientsByName = queryField('ingredientsByName', {
  type: ingredientField,
  list: true,
  args: {
    name: stringArg({ required: true }),
  },
  async resolve(_parent, args, ctx: Context, info) {
    logger.info('incoming get ingredient request', args);
    info.cacheControl.setCacheHint({ maxAge: 86400, scope: CacheScope.Public });

    const ingredients: Partial<Ingredient> = {
      name: args.name,
    };

    const result = await ctx.serviceManager.ingredientServices.get(ingredients);
    logger.info('get ingredient response', result);
    return result;
  },
});

export const filterIngredientsByPrice = queryField('filterIngredientsByPrice', {
  type: ingredientField,
  list: true,
  args: {
    currency: arg({
      type: currencyType,
      required: true,
    }),
    minAmount: floatArg({ required: true }),
    maxAmount: floatArg(),
  },
  async resolve(_parent, args, ctx: Context, info) {
    logger.info('incoming filter ingredients by price request', args);
    info.cacheControl.setCacheHint({ maxAge: 86400, scope: CacheScope.Public });

    const result = await ctx.serviceManager.ingredientServices.filterByPrice(args.currency, args.minAmount, args.maxAmount);
    logger.info('filtered ingredients by price response', result);
    return result;
  },
});

export const ingredientsPagination = objectType({
  name: 'pagination',
  definition(t) {
    t.field('paginate', {
      type: ingredientConnection,
      args: {
        first: intArg(),
        last: intArg(),
        before: idArg(),
        after: idArg(),
      },
      resolve: async (_parent, args, ctx: Context) => {
        if (args.before && !args.first) {
          throw new AppError({ message: 'need `first`.', isOperational: true });
        }

        if (args.after && !args.last) {
          throw new AppError({ message: 'need `last`.', isOperational: true });
        }

        if (args.first) {
          return ctx.serviceManager.ingredientServices.paginateBefore({
            pos: args.first, cursor: args.before,
          });
        }

        if (args.last) {
          return ctx.serviceManager.ingredientServices.paginateAfter({
            pos: args.last, cursor: args.after,
          });
        }

        return null;
      } });

    t.implements('Node');
  },
});

export const ingredientsQueries = queryField('ingredients', {
  type: ingredientsPagination,
  resolve: async () => ({ paginate: true }),
});
