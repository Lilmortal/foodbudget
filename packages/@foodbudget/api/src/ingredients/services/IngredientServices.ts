import { ingredients } from '@prisma/client';
import { Repository } from '../../shared/types/Repository.types';
import { Ingredient } from '../Ingredient.types';
import ingredientMapper from '../ingredientMapper';

export default class IngredientServices {
  constructor(private readonly repository: Repository<Ingredient, ingredients>) {
    this.repository = repository;
  }

  async get(ingredientsDto: Partial<Ingredient>): Promise<Ingredient[] | undefined> {
    const ingredientEntities = await this.repository.get(ingredientsDto);
    if (ingredientEntities && ingredientEntities.length > 0) {
      return Promise.all(ingredientEntities.map((ingredient) => ingredientMapper.toDto(ingredient)));
    }
    return undefined;
  }

  async save(ingredientsDto: Ingredient): Promise<Ingredient>;

  async save(ingredientsDto: Ingredient[]): Promise<Ingredient[]>;

  async save(ingredientsDto: Ingredient | Ingredient[]): Promise<Ingredient | Ingredient[]>;

  async save(ingredientsDto: Ingredient | Ingredient[]): Promise<Ingredient | Ingredient[]> {
    if (Array.isArray(ingredientsDto)) {
      return Promise.all(ingredientsDto.map(async (ingredient) => {
        const ingredientEntity = await this.repository.save(ingredient);
        return ingredientMapper.toDto(ingredientEntity);
      }));
    }
    const ingredientEntity = await this.repository.save(ingredientsDto);

    return ingredientMapper.toDto(ingredientEntity);
  }
}
