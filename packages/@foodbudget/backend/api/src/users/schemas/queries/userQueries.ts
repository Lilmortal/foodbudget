import logger from '@foodbudget/logger';
import { queryField, stringArg } from '@nexus/schema';
import { Context } from '../../../context';
import { User } from '../../User.types';
import { userField } from '../userFields';

export const getUser = queryField('User', {
  type: userField,
  args: {
    email: stringArg(),
  },
  async resolve(_parent, args, ctx: Context) {
    logger.info('incoming get user request', args);

    const userDto: Partial<User> = {
      email: args.email,
    };
    const result = await ctx.serviceManager.userServices.get(userDto);

    logger.info('retrieved user response', result);
    return result;
  },
});
