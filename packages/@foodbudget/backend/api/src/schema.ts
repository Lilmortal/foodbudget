import {
  makeSchema, nullabilityGuardPlugin, queryComplexityPlugin,
  interfaceType,
  queryField,
  idArg } from '@nexus/schema';
import path from 'path';
import logger from '@foodbudget/logger';
import { schemas as recipesSchema } from './recipes/schemas';
import { schemas as usersSchema } from './users/schemas';
import { schemas as ingredientsSchema } from './ingredients/schemas';
import { schemas as authSchema } from './auth/schemas';
import { Context } from './context';

const Node = interfaceType({
  name: 'Node',
  definition(t) {
    t.id('id', { description: 'GUID for a resource' });
    t.resolveType((entity) => {
      console.log(entity, 'entity');
      // return entity;
      return 'User';
    });
  },
});

const nodeQuery = queryField('node', {
  type: Node,
  args: {
    id: idArg({ required: true }),
  },
  async resolve(_, args, ctx: Context) {
    return ctx.serviceManager.userServices.get({ id: args.id });
  },
});

export const schema = makeSchema({
  types: {
    Node,
    nodeQuery,
    ...recipesSchema,
    ...usersSchema,
    ...ingredientsSchema,
    ...authSchema,
  },
  outputs: {
    schema: path.join(__dirname, './schema.graphql'),
  },
  plugins: [
    queryComplexityPlugin(),
    nullabilityGuardPlugin({
      onGuarded({ info }) {
        logger.error(
          `Error: Saw a null value for non-null field ${info.parentType.name}.${info.fieldName}`,
        );
      },
      fallbackValues: {
        ID: () => 'N/A',
        Int: () => 0,
        String: () => '',
        Boolean: () => false,
        Float: () => 0,
        Email: () => 'N/A',
      },
    }),
  ],
});
