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
    try {
      const user = await ctx.serviceManager.userServices.register({ email: args.email, password: args.password });

      if (user) {
        logger.info(`${user.email} has registered.`);
        return user;
      }
      logger.warn(`${args.email} is already registered.`);
      return null;
    } catch (err) {
      logger.error(err.message);
      return null;
    }
  },
});

export default register;
