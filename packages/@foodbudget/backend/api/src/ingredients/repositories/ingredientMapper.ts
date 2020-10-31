import { ingredients } from '@prisma/client';
import Mapper from '../../shared/types/Mapper.types';
import { Ingredient } from '../Ingredient.types';

const ingredientMapper: Mapper<Ingredient, ingredients> = ({
  fromDto: (dto: Ingredient): ingredients => ({
    name: dto.name,
    price_currency: dto.price?.currency || null,
    price_amount: dto.price?.amount || null,
    usersId: null,
  }),
  toDto: (entity: ingredients): Ingredient => ({
    name: entity.name,
    ...(entity.price_currency && entity.price_amount) && {
      price: {
        currency: entity.price_currency,
        amount: entity.price_amount,
      },
    },
  }),
});

export default ingredientMapper;
