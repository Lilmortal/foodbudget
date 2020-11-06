import { arg, mutationField, stringArg } from '@nexus/schema';
import logger from '@foodbudget/logger';
import { Context } from '../../../context';
import { emailArg } from '../../../shared/scalar/emailArg';
import { userField } from '../../../users/schemas';

export const register = mutationField('register', {
  type: userField,
  args: {
    email: arg({ type: emailArg, required: true }),
    password: stringArg({ required: true }),
  },
  async resolve(_parent, args, ctx: Context) {
    logger.info('register user request', args);
    const user = await ctx.serviceManager.authServices.register({ email: args.email, password: args.password });

    if (user) {
      logger.info('email has been registered.');
      return user;
    }
    logger.warn('email is already registered.');
    return null;
  },
});
