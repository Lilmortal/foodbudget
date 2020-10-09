import { makeSchema } from '@nexus/schema';
import * as recipesSchema from './recipes/schema';

const schema = makeSchema({
  types: {
    ...recipesSchema,
  },
  outputs: {
    // schema: path.join(__dirname, '../schema.graphql'),
  },
});

export default schema;
