import { recipes } from '@prisma/client';
import { Ingredient } from '../ingredients';

// Any newly added values here need to be added to schema.prisma and recipe schemaFields

export type Cuisine =
  | 'AMERICAN'
  | 'ITALIAN'
  | 'ASIAN'
  | 'MEXICAN'
  | 'SOUTHERN_AND_SOUL_FOOD'
  | 'FRENCH'
  | 'SOUTH_WESTERN'
  | 'BARBEQUE'
  | 'INDIAN'
  | 'CHINESE'
  | 'CAJUN_AND_CREOLE'
  | 'MEDITERRANEAN'
  | 'GREEK'
  | 'ENGLISH'
  | 'SPANISH'
  | 'THAI'
  | 'GERMAN'
  | 'MOROCCAN'
  | 'IRISH'
  | 'JAPANESE'
  | 'CUBAN'
  | 'HAWAIIAN'
  | 'SWEDISH'
  | 'HUNGARIAN'
  | 'PORTUGUESE';

export type Diet =
  | 'KETOGENIC'
  | 'VEGETARIAN_NO_MEAT_AND_EGGS'
  | 'VEGETARIAN_NO_MEAT_AND_DAIRY'
  | 'PESCATARIAN'
  | 'VEGAN'
  | 'LOW_FOODMAP'
  | 'VEGETARIAN'
  | 'PALEO';

export type Allergy =
  | 'GLUTEN'
  | 'PEANUT'
  | 'SEAFOOD'
  | 'SESAME'
  | 'SOY'
  | 'DIARY'
  | 'EGG'
  | 'SULPHITE'
  | 'TREE_NUT'
  | 'WHEAT';

export type Meal = 'BREAKFAST' | 'LUNCH' | 'DINNER';

export interface Measurement {
  amount?: number;
  measurement?: string;
}

export interface RecipeIngredient
  extends Omit<Ingredient, 'name'>,
    Measurement {
  text: string;
  name?: string;
}

export interface Recipe {
  id: number;
  link: string;
  prepTime: string;
  servings: number;
  numSaved: number;
  name: string;
  ingredients: RecipeIngredient[];
  cuisines: Cuisine[];
  diets: Diet[];
  allergies: Allergy[];
  adjectives: string[];
  meals: Meal[];
}

export interface IngredientResponse {
  name: string | null;
  // eslint-disable-next-line camelcase
  price_currency: string | null;
  // eslint-disable-next-line camelcase
  price_amount: number | null;
}

export interface RecipeIngredientResponse {
  ingredient: IngredientResponse | null;
  amount: number | null;
  measurement: string | null;
  // eslint-disable-next-line camelcase
  recipe_text: string;
}

export interface RecipeResponse extends recipes {
  ingredients: RecipeIngredientResponse[];
}
