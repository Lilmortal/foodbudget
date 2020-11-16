import { enumType, inputObjectType, objectType } from '@nexus/schema';
import { pageInfo } from '../../shared/field/pageInfo';

export const currencyType = enumType({
  name: 'Currency',
  members: ['AUD', 'NZD'],
});

export const priceField = objectType({
  name: 'price',
  definition(t) {
    t.string('currency');
    t.float('amount');
  },
});

export const ingredientField = objectType({
  name: 'ingredient',
  definition(t) {
    t.string('name');
    t.field('price', { type: priceField });
    t.implements('Node');
  },
});

export const priceArg = inputObjectType({
  name: 'priceArg',
  definition(t) {
    t.string('currency', { required: true });
    t.float('amount', { required: true });
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
    t.int('totalCount');
    t.list.field('edges', { type: ingredientEdge });
    t.field('pageInfo', { type: pageInfo });
  },
});
