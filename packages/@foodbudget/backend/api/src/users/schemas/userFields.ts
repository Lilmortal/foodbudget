import { objectType } from '@nexus/schema';

export const userField = objectType({
  name: 'User',
  definition(t) {
    t.string('email', { description: 'user email.' });
    t.string('nickname', { description: 'user name that will be shown to others.' });
    t.implements('Node');
  },
});
