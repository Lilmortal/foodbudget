import {
  fieldAuthorizePlugin, makeSchema, nullabilityGuardPlugin, queryComplexityPlugin,
} from '@nexus/schema';
import path from 'path';
import logger from '@foodbudget/logger';
import { schemas as recipesSchema } from './recipes/schemas';
import { schemas as usersSchema } from './users/schemas';
import { schemas as ingredientsSchema } from './ingredients/schemas';
import { schemas as authSchema } from './auth/schemas';

export const schema = makeSchema({
  types: {
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
    fieldAuthorizePlugin(),
    nullabilityGuardPlugin({
      onGuarded({ info }) {
        logger.error(
          `Error: Saw a null value for non-null field ${info.parentType.name}.${info.fieldName}`,
        );
      },
      fallbackValues: {
        Int: () => 0,
        String: () => '',
        Boolean: () => false,
        Float: () => 0,
        Email: () => 'N/A',
      },
    }),
  ],
});
