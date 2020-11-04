import logger from '@foodbudget/logger';
import {
  arg, intArg, objectType, queryField,
} from '@nexus/schema';
import { users } from '@prisma/client';
import { Context } from '../../context';
import { emailArg } from '../../shared/scalar/emailArg';

export const userField = objectType({
  name: 'user',
  definition(t) {
    t.string('email', { description: 'user email.' });
    t.string('nickname', { description: 'user name that will be shown to others.' });
  },
});

export const getUser = queryField('user', {
  type: userField,
  args: {
    id: intArg(),
    email: arg({ type: emailArg }),
  },
  async resolve(_parent, args, ctx: Context) {
    logger.info('incoming get user request', args);

    const userDto: Partial<users> = {
      id: args.id,
      email: args.email,
    };
    const result = await ctx.serviceManager.userServices.get(userDto);

    logger.info('retrieved user response', result);
    return result;
  },
});
