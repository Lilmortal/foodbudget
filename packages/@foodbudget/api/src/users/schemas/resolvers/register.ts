import { mutationField, stringArg } from '@nexus/schema';
import logger from '@foodbudget/logger';
import { Context } from '../../../context';
import { userField } from '../schema';

const register = mutationField('register', {
  type: userField,
  args: {
    email: stringArg({ required: true }),
    password: stringArg({ required: true }),
  },
  async resolve(_parent, args, ctx: Context) {
    logger.info('register user request: %o', args);
    const user = await ctx.serviceManager.userServices.register({ email: args.email, password: args.password });

    if (user) {
      logger.info(`${user.email} has been registered.`);
      return user;
    }
    logger.warn(`${args.email} is already registered.`);
    return null;
  },
});

export default register;
