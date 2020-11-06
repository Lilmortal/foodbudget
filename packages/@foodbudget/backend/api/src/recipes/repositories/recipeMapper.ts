import { Mapper } from '../../types/Mapper';
import { Recipe, RecipeResponse } from '../Recipe.types';

export const recipeMapper: Mapper<Recipe, RecipeResponse> = ({
  fromDto: (dto: Recipe): RecipeResponse => ({
    id: dto.id,
    name: dto.name,
    link: dto.link,
    prep_time: dto.prepTime,
    servings: dto.servings,
    num_saved: dto.numSaved,
    adjectives: dto.adjectives,
    allergies: dto.allergies,
    cuisines: dto.cuisines,
    diets: dto.diets,
    meals: dto.meals,
    ingredients: dto.ingredients.map((ingredient) => ({
      ingredient: {
        name: ingredient.name || null,
        price_currency: ingredient.price?.currency || null,
        price_amount: ingredient.price?.amount || 0,
      },
      amount: ingredient.amount || 0,
      measurement: ingredient.measurement || null,
      recipe_text: ingredient.text,
    })),
    usersId: null,
  }),
  toDto: (entity: RecipeResponse): Recipe => ({
    id: entity.id,
    name: entity.name,
    link: entity.link,
    prepTime: entity.prep_time,
    servings: entity.servings,
    numSaved: entity.num_saved,
    ingredients: entity.ingredients.map((entityIngredient) => ({
      amount: entityIngredient.amount || 0,
      measurement: entityIngredient.measurement || undefined,
      text: entityIngredient.recipe_text,
      name: entityIngredient.ingredient?.name || undefined,
      price: {
        currency: entityIngredient.ingredient?.price_currency || '',
        amount: entityIngredient.ingredient?.price_amount || 0,
      },
    })),
    cuisines: entity.cuisines,
    diets: entity.diets,
    allergies: entity.allergies,
    adjectives: entity.adjectives,
    meals: entity.meals,
  }),
});
