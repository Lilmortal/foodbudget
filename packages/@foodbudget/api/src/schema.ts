import { makeSchema } from '@nexus/schema';
import * as recipesSchema from './recipes/schemas';
import * as usersSchema from './users/schemas';
import * as ingredientsSchema from './ingredients/schemas';
import * as authSchema from './auth/schemas';

const schema = makeSchema({
  types: {
    ...recipesSchema,
    ...usersSchema,
    ...ingredientsSchema,
    ...authSchema,
  },
  outputs: {
  },
});

export default schema;
