import { mutationField, stringArg } from '@nexus/schema';
import logger from '@foodbudget/logger';
import { Context } from '../../../context';

const login = mutationField('login', {
  type: 'String',
  args: {
    email: stringArg({ required: true }),
    password: stringArg({ required: true }),
  },
  async resolve(_parent, args, ctx: Context) {
    logger.info('login request: %o', args);
    const user = await ctx.serviceManager.userServices.login({ email: args.email, password: args.password });

    if (user) {
      logger.info(`${user.email} has logged in.`);
      const refreshToken = ctx.serviceManager.authServices.createRefreshToken(user.id.toString());
      const accessToken = ctx.serviceManager.authServices.createAccessToken(user.id.toString());

      ctx.res.cookie(refreshToken.name, refreshToken.value, refreshToken.options);
      return accessToken;
    }

    logger.warn(`${args.email} failed to login.`);
    return null;
  },
});

export default login;
