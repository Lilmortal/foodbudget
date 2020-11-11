import logger from '@foodbudget/logger';
import {
  arg, floatArg, intArg, objectType, queryField, stringArg,
} from '@nexus/schema';
import { CacheScope } from 'apollo-cache-control';
import { Context } from '../../../context';
import { Ingredient } from '../../Ingredient.types';
import { currencyType, ingredientField } from '../ingredientFields';

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

export const PageInfo = objectType({
  name: 'PageInfo',
  definition(t) {
    t.string('startCursor', { nullable: true });
    t.string('endCursor', { nullable: true });
    t.boolean('hasPreviousPage');
    t.boolean('hasNextPage');
  },
});

export const ingredientEdge = objectType({
  name: 'ingredientEdge',
  definition(t) {
    t.string('cursor');
    t.field('node', { type: ingredientField });
  },
});

export const ingredientConnection = objectType({
  name: 'ingredientConnection',
  definition(t) {
    t.int('total_count');
    t.list.field('edges', { type: ingredientEdge });
    t.field('pageInfo', { type: PageInfo });
  },
});

export const ingredientsPagination = queryField('ingredients', {
  type: ingredientConnection,
  nullable: true,
  args: {
    first: intArg(),
    last: intArg(),
    cursor: stringArg(),
  },
  resolve: async (_parent, args, ctx: Context) => {
    const result = ctx.serviceManager.ingredientServices.paginate({
      first: args.first, last: args.last, cursor: args.cursor,
    });
    return result;
  },
});
