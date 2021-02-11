import { mutationField } from '@nexus/schema';
import logger from '@foodbudget/logger';
import { Context } from '../../../context';
import { userField } from '../../../users/schemas';
import { emailArg } from '../../../shared/scalar/emailArg';

export const deleteUser = mutationField('deleteUser', {
  type: userField,
  args: {
    email: emailArg,
  },
  async resolve(_parent, args, ctx: Context) {
    logger.info('delete user request', args);

    const deletedUser = await ctx.serviceManager.userServices.delete(
      args.email,
    );

    if (deletedUser) {
      logger.info('delete user response', deletedUser);
      return deletedUser;
    }

    logger.warn(`failed to delete ${args.email}.`);
    return false;
  },
});
