import { intArg, mutationField } from '@nexus/schema';
import logger from '@foodbudget/logger';
import { Context } from '../../../context';

const deleteUser = mutationField('deleteUser', {
  type: 'String',
  args: {
    id: intArg({ required: true }),
  },
  async resolve(_parent, args, ctx: Context) {
    try {
      const isUserDeleted = await ctx.serviceManager.userServices.delete(args.id);

      if (isUserDeleted) {
        logger.info(`User with id ${args.id} has been deleted.`);
        return true;
      }

      logger.warn(`Failed to delete user with id ${args.id}.`);
      return false;
    } catch (err) {
      logger.error(err.message);
      return null;
    }
  },
});

export default deleteUser;
