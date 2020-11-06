import { Recipe, RecipeResponse } from '../Recipe.types';
import { recipeMapper } from './recipeMapper';

describe('recipe mapper', () => {
  it('should map recipe dto to entity', () => {
    const dto: Recipe = {
      id: 1,
      name: 'pork',
      link: 'link',
      prepTime: '4',
      servings: 3,
      numSaved: 1,
      ingredients: [{
        text: 'ingredient text',
      }],
      cuisines: ['AMERICAN'],
      diets: ['KETOGENIC'],
      adjectives: ['ROMANTIC'],
      allergies: ['DIARY'],
      meals: ['BREAKFAST'],
    };

    const entity = recipeMapper.fromDto(dto);

    expect(entity).toEqual({
      id: 1,
      name: 'pork',
      link: 'link',
      prep_time: '4',
      servings: 3,
      num_saved: 1,
      ingredients: [{
        amount: 0,
        ingredient: {
          name: null,
          price_amount: 0,
          price_currency: null,
        },
        measurement: null,
        recipe_text: 'ingredient text',
      }],
      cuisines: ['AMERICAN'],
      diets: ['KETOGENIC'],
      adjectives: ['ROMANTIC'],
      allergies: ['DIARY'],
      meals: ['BREAKFAST'],
      usersId: null,
    });
  });

  it('should map recipe entity to dto', () => {
    const entity: RecipeResponse = {
      id: 1,
      name: 'pork',
      link: 'link',
      prep_time: '4',
      servings: 3,
      num_saved: 1,
      ingredients: [{
        ingredient: {
          name: 'mushroom',
          price_currency: 'NZD',
          price_amount: 4,
        },
        amount: 2,
        measurement: 'kg',
        recipe_text: 'pork recipe',
      }],
      cuisines: ['AMERICAN'],
      diets: ['KETOGENIC'],
      adjectives: ['ROMANTIC'],
      allergies: ['DIARY'],
      meals: ['BREAKFAST'],
      usersId: 1,
    };

    const dto = recipeMapper.toDto(entity);

    expect(dto).toEqual({
      id: 1,
      name: 'pork',
      link: 'link',
      prepTime: '4',
      servings: 3,
      numSaved: 1,
      ingredients: [{
        text: 'pork recipe',
        name: 'mushroom',
        amount: 2,
        measurement: 'kg',
        price: {
          amount: 4,
          currency: 'NZD',
        },
      }],
      cuisines: ['AMERICAN'],
      diets: ['KETOGENIC'],
      adjectives: ['ROMANTIC'],
      allergies: ['DIARY'],
      meals: ['BREAKFAST'],
    });
  });
});
