import { enumType, inputObjectType, objectType } from '@nexus/schema';

export const currencyType = enumType({
  name: 'currencies',
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
  },
});

export const priceArg = inputObjectType({
  name: 'priceArg',
  definition(t) {
    t.string('currency', { required: true });
    t.float('amount', { required: true });
  },
});
