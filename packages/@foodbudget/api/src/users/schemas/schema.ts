import {
  intArg, objectType, queryField, stringArg,
} from '@nexus/schema';
import { users } from '@prisma/client';
import { Context } from '../../context';

export const userField = objectType({
  name: 'user',
  definition(t) {
    // @TODO: Don't show id, keep this for debugging for now
    t.int('id');
    t.string('googleId');
    t.string('facebookId');
    t.string('password');
    t.string('email', { description: 'user email.' });
    t.string('nickname');
  },
});

const getUser = queryField('user', {
  type: userField,
  args: {
    id: intArg(),
    email: stringArg(),
  },
  resolve(_parent, args, ctx: Context) {
    const userDto: Partial<users> = {
      id: args.id,
      email: args.email,
    };
    return ctx.serviceManager.userServices.get(userDto) || '';
  },
});

export default getUser;
