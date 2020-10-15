import {
  intArg, objectType, queryField, stringArg,
} from '@nexus/schema';
import { users } from '@prisma/client';
import { Context } from '../../context';

export const userField = objectType({
  name: 'user',
  definition(t) {
    t.string('email', { description: 'user email.' });
    t.string('nickname', { description: 'user name that will be shown to others.' });
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