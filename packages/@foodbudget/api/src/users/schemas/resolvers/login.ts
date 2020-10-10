import { mutationField } from '@nexus/schema';
import logger from '@foodbudget/logger';
import { Context } from '../../../shared/types/ApolloServer.types';

const login = mutationField('login', {
  type: 'String',
  args: {

  },
  async resolve(_parent, args, ctx: Context) {
    logger.info('login');
  },
});

export default login;
