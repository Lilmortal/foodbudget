import { inputObjectType, objectType } from '@nexus/schema';

export const ingredientField = objectType({
  name: 'ingredient',
  definition(t) {
    t.string('name');
    t.string('price_currency');
    t.float('price_amount');
  },
});

export const priceArg = inputObjectType({
  name: 'priceArg',
  definition(t) {
    t.string('currency', { required: true });
    t.float('amount', { required: true });
  },
});
