import {
  makeSchema,
  nullabilityGuardPlugin,
  queryComplexityPlugin,
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
    // TODO: Fix hard coded path
    schema: path.join(__dirname, '../../../shared/schema/schema.graphql'),
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
