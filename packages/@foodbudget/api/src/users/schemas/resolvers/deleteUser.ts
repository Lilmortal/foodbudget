import { intArg, mutationField } from '@nexus/schema';
import logger from '@foodbudget/logger';
import { Context } from '../../../context';

const deleteUser = mutationField('deleteUser', {
  type: 'String',
  args: {
    id: intArg({ required: true }),
  },
  async resolve(_parent, args, ctx: Context) {
    logger.info('delete user request: %o', args);

    const deletedUser = await ctx.serviceManager.userServices.delete(args.id);

    if (deletedUser) {
      logger.info('delete user response: %o', deletedUser);
      return deletedUser;
    }

    logger.warn(`failed to delete user with id ${args.id}.`);
    return false;
  },
});

export default deleteUser;
