import Mapper from '../../shared/types/Mapper.types';
import { Recipe, RecipeResponse } from '../Recipe.types';

const recipeMapper: Mapper<Recipe, RecipeResponse> = ({
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
        name: ingredient.name,
        price_currency: ingredient.price.currency,
        price_amount: ingredient.price.amount,
      },
      quantity: ingredient.quantity,
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
    ingredients: entity.ingredients.map((ingredient) => ({
      quantity: ingredient.quantity,
      name: ingredient.ingredient.name,
      price: {
        currency: ingredient.ingredient.price_currency,
        amount: ingredient.ingredient.price_amount,
      },
    })),
    cuisines: entity.cuisines,
    diets: entity.diets,
    allergies: entity.allergies,
    adjectives: entity.adjectives,
    meals: entity.meals,
  }),
});

export default recipeMapper;
