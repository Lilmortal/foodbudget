import { enumType, inputObjectType, objectType } from '@nexus/schema';
import { priceArg, priceField } from '../../ingredients';

export const cuisineType = enumType({
  name: 'cuisines',
  members: ['AMERICAN',
    'ITALIAN',
    'ASIAN',
    'MEXICAN',
    'SOUTHERN_AND_SOUL_FOOD',
    'FRENCH',
    'SOUTH_WESTERN',
    'BARBEQUE',
    'INDIAN',
    'CHINESE',
    'CAJUN_AND_CREOLE',
    'MEDITERRANEAN',
    'GREEK',
    'ENGLISH',
    'SPANISH',
    'THAI',
    'GERMAN',
    'MOROCCAN',
    'IRISH',
    'JAPANESE',
    'CUBAN',
    'HAWAIIAN',
    'SWEDISH',
    'HUNGARIAN',
    'PORTUGUESE'],
});

export const dietType = enumType({
  name: 'diets',
  members: ['KETOGENIC',
    'VEGETARIAN_NO_MEAT_AND_EGGS',
    'VEGETARIAN_NO_MEAT_AND_DAIRY',
    'PESCATARIAN',
    'VEGAN',
    'LOW_FOODMAP',
    'VEGETARIAN',
    'PALEO'],
});

export const allergyType = enumType({
  name: 'allergies',
  members: ['GLUTEN',
    'PEANUT',
    'SEAFOOD',
    'SESAME',
    'SOY',
    'DIARY',
    'EGG',
    'SULPHITE',
    'TREE_NUT',
    'WHEAT'],
});

export const adjectiveType = enumType({
  name: 'adjectives',
  members: ['ROMANTIC'],
});

export const mealType = enumType({
  name: 'meals',
  members: ['BREAKFAST', 'LUNCH', 'DINNER'],
});

export const recipeIngredientField = objectType({
  name: 'recipeIngredient',
  definition(t) {
    t.int('amount');
    t.string('measurement');
    t.string('text');
    t.string('name');
    t.field('price', { type: priceField });
  },
});

export const recipeField = objectType({
  name: 'recipe',
  definition(t) {
    t.string('id');
    t.string('name');
    t.string('link');
    t.string('prepTime');
    t.int('servings');
    t.int('numSaved');
    t.list.field('ingredients', { type: recipeIngredientField });
    t.list.string('cuisines');
    t.list.string('diets');
    t.list.string('allergies');
    t.list.string('adjectives');
    t.list.string('meals');
  },
});

export const recipeIngredientArg = inputObjectType({
  name: 'recipeIngredientArg',
  definition(t) {
    t.int('amount');
    t.string('measurement');
    t.string('text');
    t.string('name');
    t.field('price', { type: priceArg });
  },
});
