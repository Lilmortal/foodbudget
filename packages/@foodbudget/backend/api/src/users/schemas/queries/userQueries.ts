import logger from '@foodbudget/logger';
import { idArg, queryField } from '@nexus/schema';
import { Context } from '../../../context';
import { emailArg } from '../../../scalar/emailArg';
import { User } from '../../User.types';
import { userField } from '../userFields';

export const getUser = queryField('User', {
  type: userField,
  args: {
    id: idArg({ required: true }),
    // email: arg({ type: emailArg }),
  },
  async resolve(_parent, args, ctx: Context) {
    logger.info('incoming get user request', args);

    const userDto: Partial<User> = {
      id: args.id,
      // email: args.email,
    };
    const result = await ctx.serviceManager.userServices.get(userDto);

    logger.info('retrieved user response', result);
    return result;
  },
});
