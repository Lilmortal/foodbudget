import { mutationField, stringArg } from '@nexus/schema';
import logger from '@foodbudget/logger';
import { Context } from '../../../context';
import { userField } from '../schema';
import { renewAuthRefreshToken } from '../../../shared/tokens';

const login = mutationField('login', {
  type: userField,
  args: {
    email: stringArg({ required: true }),
    password: stringArg({ required: true }),
  },
  async resolve(_parent, args, ctx: Context) {
    const user = await ctx.serviceManager.userServices.login({ email: args.email, password: args.password });

    if (user) {
      logger.info(`${user.email} has logged in.`);
      renewAuthRefreshToken(
        user.id.toString(), ctx.config.token.refresh.secret, ctx.config.token.refresh.expireTime,
      );
      return user;
    }

    logger.warn(`${args.email} failed to login.`);
    return null;
  },
});

export default login;
