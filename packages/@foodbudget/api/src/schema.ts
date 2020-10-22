import { makeSchema } from '@nexus/schema';
import * as recipesSchema from './recipes/schemas';
import * as usersSchema from './users/schemas';
import * as ingredientsSchema from './ingredients/schemas';

const schema = makeSchema({
  types: {
    ...recipesSchema,
    ...usersSchema,
    ...ingredientsSchema,
  },
  outputs: {
    // schema: path.join(__dirname, '../schema.graphql'),
  },
});

export default schema;
