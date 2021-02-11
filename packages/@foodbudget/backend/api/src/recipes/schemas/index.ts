import * as queries from './queries';
import * as resolvers from './resolvers';

export const schemas = { ...queries, ...resolvers };

export {
  cuisineType,
  adjectiveType,
  allergyType,
  dietType,
  mealType,
  recipeField,
  recipeIngredientField,
  recipeIngredientArg,
} from './recipeFields';
