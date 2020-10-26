import { AppError } from '@foodbudget/errors';
import logger from '@foodbudget/logger';
import { queryField } from '@nexus/schema';
import { Context } from '../../context';

// eslint-disable-next-line import/prefer-default-export
export const renewToken = queryField('renewToken', {
  type: 'String',
  async resolve(_parent, args, ctx: Context) {
    logger.info('renewing tokens...');

    const { authServices } = ctx.serviceManager;

    const refreshToken = ctx.req.cookies[authServices.refreshTokenKey];

    if (!refreshToken) {
      throw new AppError(
        {
          message: 'refresh token either expired or does not exist. Redirecting to login page...',
          isOperational: true,
          httpStatus: 401,
        },
      );
    }

    const { accessToken, refreshToken: renewedRefreshToken } = await authServices.renewTokens(refreshToken);

    ctx.res.cookie(renewedRefreshToken.name, renewedRefreshToken.value, renewedRefreshToken.options);

    // TODO: Somewhere headers are already sent?
    ctx.res.status(200).send({
      accessToken,
    });
    logger.info('tokens renewed.');
  },
});
