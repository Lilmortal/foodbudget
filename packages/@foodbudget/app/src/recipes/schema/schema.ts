import {
  mutationField, objectType, queryField, stringArg,
} from '@nexus/schema';
import { Context } from '../../types/ApolloServer.types';

export const Book = objectType({
  name: 'Book',
  definition(t) {
    t.int('id', { description: 'Id boy', resolve: (_root, test, ctx) => 'TEST' });
    t.string('title', { description: 'hmm' });
  },
});

export const Fish = objectType({
  name: 'fish',
  definition(t) {
    t.string('name');
  },
});

export const Test = queryField('test', {
  type: Book,
  resolve(_root, test, ctx) {
    console.log('test', ctx);
  },
});

export const mut = mutationField('create', {
  type: 'String',
  args: { name: stringArg({ required: true }) },
  resolve(_root, test, ctx: Context) {
    console.log(_root, test, ctx);
    return 'lol';
  },
});
