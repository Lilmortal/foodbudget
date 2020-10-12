import { recipes } from '@prisma/client';
import { Repository } from '../../shared/types/Repository.types';
import { Recipe } from '../Recipe.types';
import { RecipeServicesParams } from './RecipeServices.types';

export default class RecipeServices {
    private readonly repository: Repository<Recipe, recipes>;

    constructor({ repository }: RecipeServicesParams) {
      this.repository = repository;
    }

    async get(recipe: Partial<Recipe>): Promise<recipes[] | undefined> {
      return this.repository.getMany(recipe);
    }

    async save(recipesDto: Recipe | Recipe[]): Promise<void> {
      if (Array.isArray(recipesDto)) {
        await Promise.all(recipesDto.map((recipe) => this.repository.create(recipe)));
      }

      await this.repository.create(recipesDto);
    }
}
