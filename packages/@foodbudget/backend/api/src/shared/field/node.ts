import { idArg, interfaceType, queryField } from '@nexus/schema';
import { Context } from '../../context';

export const nodeInterface = interfaceType({
  name: 'Node',
  definition(t) {
    t.id('id', { description: 'GUID for a resource' });
    t.resolveType((item: any) => {
      console.log(item, 'idddd');
      return 'pagination';
    });
  },
});

export const nodeQuery = queryField('node', {
  type: nodeInterface,
  args: {
    id: idArg({ required: true }),
  },
  async resolve(_, args, ctx: Context) {
    return ctx.serviceManager.ingredientServices.get({ name: args.id });
  },
});
