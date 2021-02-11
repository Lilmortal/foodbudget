import { AppError } from '@foodbudget/errors';
import logger from '@foodbudget/logger';
import { queryField } from '@nexus/schema';
import { Context } from '../../../context';

// eslint-disable-next-line import/prefer-default-export
export const renewToken = queryField('renewToken', {
  type: 'String',
  async resolve(_parent, args, ctx: Context) {
    logger.info('renewing tokens...');

    const { tokenServices } = ctx.serviceManager;

    const refreshToken = ctx.req.cookies[tokenServices.refreshTokenKey];

    if (!refreshToken) {
      throw new AppError({
        message: 'refresh token either expired or does not exist.',
        isOperational: true,
        httpStatus: 401,
      });
    }

    const envConfig = ctx.config.env;
    const {
      accessToken,
      refreshToken: renewedRefreshToken,
    } = await tokenServices.renewTokens(refreshToken, envConfig);

    ctx.res.cookie(
      renewedRefreshToken.name,
      renewedRefreshToken.value,
      renewedRefreshToken.options,
    );

    logger.info('tokens renewed.');

    return accessToken;
  },
});
