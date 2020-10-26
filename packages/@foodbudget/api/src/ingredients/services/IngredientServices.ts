import { AppError } from '@foodbudget/errors';
import { Currency, Ingredient } from '../Ingredient.types';
import { FilterableIngredientRepository } from '../repositories/IngredientRepository';

export default class IngredientServices {
  constructor(private readonly repository: FilterableIngredientRepository) {
    this.repository = repository;
  }

  async get(ingredientsDto: Partial<Ingredient>): Promise<Ingredient[] | undefined> {
    const ingredients = await this.repository.get(ingredientsDto);
    return ingredients;
  }

  async filterByPrice(currency: Currency, minAmount: number, maxAmount?: number): Promise<Ingredient[] | undefined> {
    if (maxAmount !== undefined && minAmount > maxAmount) {
      throw new AppError({
        message: 'minAmount must be less than or equal to maxAmount',
        isOperational: true,
      });
    }

    const filteredIngredients = await this.repository.filterByPrice(currency, minAmount, maxAmount);
    return filteredIngredients;
  }

  async save(ingredientsDto: Ingredient): Promise<Ingredient>;

  async save(ingredientsDto: Ingredient[]): Promise<Ingredient[]>;

  async save(ingredientsDto: Ingredient | Ingredient[]): Promise<Ingredient | Ingredient[]>;

  async save(ingredientsDto: Ingredient | Ingredient[]): Promise<Ingredient | Ingredient[]> {
    if (Array.isArray(ingredientsDto)) {
      return Promise.all(ingredientsDto.map(async (ingredient) => this.repository.save(ingredient)));
    }

    return this.repository.save(ingredientsDto);
  }
}
