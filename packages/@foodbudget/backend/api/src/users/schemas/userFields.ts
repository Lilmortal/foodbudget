import { objectType } from '@nexus/schema';

export const userField = objectType({
  name: 'user',
  definition(t) {
    t.string('email', { description: 'user email.' });
    t.string('nickname', { description: 'user name that will be shown to others.' });
  },
});
