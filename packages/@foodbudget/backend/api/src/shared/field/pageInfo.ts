import { objectType } from '@nexus/schema';

export const pageInfo = objectType({
  name: 'PageInfo',
  definition(t) {
    t.string('startCursor', { nullable: true });
    t.string('endCursor', { nullable: true });
    t.boolean('hasPreviousPage');
    t.boolean('hasNextPage');
  },
});
