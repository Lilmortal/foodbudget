import { ingredients } from '@prisma/client';
import { Ingredient } from '../Ingredient.types';
import { ingredientMapper } from './ingredientMapper';

describe('ingredient mapper', () => {
  it('should map ingredient dto to entity', () => {
    const dto: Ingredient = {
      name: 'pork',
      price: {
        currency: 'NZD',
        amount: 4,
      },
    };

    const entity = ingredientMapper.fromDto(dto);

    expect(entity).toEqual({
      name: 'pork',
      price_amount: 4,
      price_currency: 'NZD',
      usersId: null,
    });
  });

  it('should map ingredient entity to dto', () => {
    const entity: ingredients = {
      name: 'pork',
      price_currency: 'NZD',
      price_amount: 4,
      usersId: 4,
    };

    const dto = ingredientMapper.toDto(entity);

    expect(dto).toEqual({
      name: 'pork',
      price: {
        amount: 4,
        currency: 'NZD',
      },
    });
  });
});
