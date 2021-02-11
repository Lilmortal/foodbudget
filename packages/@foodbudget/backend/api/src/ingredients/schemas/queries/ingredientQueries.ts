import { AppError } from '@foodbudget/errors';
import logger from '@foodbudget/logger';
import {
  arg,
  floatArg,
  idArg,
  intArg,
  queryField,
  stringArg,
} from '@nexus/schema';
import { CacheScope } from 'apollo-cache-control';
import { Context } from '../../../context';
import { Ingredient } from '../../Ingredient.types';
import {
  currencyType,
  ingredientConnection,
  ingredientField,
} from '../ingredientFields';

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

    const result = await ctx.serviceManager.ingredientServices.filterByPrice(
      args.currency,
      args.minAmount,
      args.maxAmount,
    );
    logger.info('filtered ingredients by price response', result);
    return result;
  },
});

export const ingredientsQueries = queryField('ingredients', {
  type: ingredientConnection,
  args: {
    first: intArg(),
    last: intArg(),
    before: idArg(),
    after: idArg(),
  },
  resolve: async (_parent, args, ctx: Context) => {
    logger.info('incoming get ingredients pagination request', args);

    if (args.first != null && args.last != null) {
      throw new AppError({
        message: 'must specify first or last, but not both',
        isOperational: true,
      });
    }

    if (args.before != null && args.first == null) {
      throw new AppError({
        message: "need 'first' when 'before' is specified.",
        isOperational: true,
      });
    }

    if (args.after != null && args.last == null) {
      throw new AppError({
        message: "need 'last' when 'after' is specified.",
        isOperational: true,
      });
    }

    if (args.first != null && args.first <= 0) {
      throw new AppError({
        message: "'first' must be greater than 0.",
        isOperational: true,
      });
    }

    if (args.last != null && args.last <= 0) {
      throw new AppError({
        message: "'last' must be greater than 0.",
        isOperational: true,
      });
    }

    let result = null;
    if (args.first != null) {
      result = await ctx.serviceManager.ingredientServices.paginateBefore({
        pos: args.first,
        cursor: args.before,
      });
    }

    if (args.last != null) {
      result = await ctx.serviceManager.ingredientServices.paginateAfter({
        pos: args.last,
        cursor: args.after,
      });
    }

    logger.info('ingredients pagination response', result);
    return result;
  },
});
