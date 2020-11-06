import * as queries from './queries';
import * as resolvers from './resolvers';

export const schemas = { ...queries, ...resolvers };
