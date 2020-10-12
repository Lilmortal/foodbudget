import { mutationField } from '@nexus/schema';
import logger from '@foodbudget/logger';

const login = mutationField('login', {
  type: 'String',
  args: {

  },
  async resolve(_parent, args, ctx: any) {
    logger.info('login');
  },
});

export default login;
