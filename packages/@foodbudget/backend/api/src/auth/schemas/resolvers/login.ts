import { arg, mutationField, stringArg } from '@nexus/schema';
import logger from '@foodbudget/logger';
import { Context } from '../../../context';
import { emailArg } from '../../../shared/scalar/emailArg';

export const login = mutationField('login', {
  type: 'String',
  args: {
    email: arg({ type: emailArg, required: true }),
    password: stringArg({ required: true }),
  },
  async resolve(_parent, args, ctx: Context) {
    logger.info('login request', args);
    const user = await ctx.serviceManager.authServices.login({ email: args.email, password: args.password });

    // const envConfig = ctx.serviceManager.
    if (user) {
      logger.info('user has logged in.');
      const refreshToken = ctx.serviceManager.tokenServices.createRefreshToken(user.id.toString());
      const accessToken = ctx.serviceManager.tokenServices.createAccessToken(user.id.toString());

      ctx.res.cookie(refreshToken.name, refreshToken.value, refreshToken.options);
      return accessToken;
    }

    logger.warn('user failed to login.');
    return null;
  },
});
