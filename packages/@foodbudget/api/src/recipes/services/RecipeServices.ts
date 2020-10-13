import { recipes } from '@prisma/client';
import { Repository } from '../../shared/types/Repository.types';
import { RecipeServicesParams } from './RecipeServices.types';

export default class RecipeServices {
    private readonly repository: Repository<recipes>;

    constructor({ repository }: RecipeServicesParams) {
      this.repository = repository;
    }

    async get(recipeEntity: Partial<recipes>): Promise<recipes[] | undefined> {
      return this.repository.getMany(recipeEntity);
    }

    async save(recipesEntity: recipes | recipes[]): Promise<void> {
      if (Array.isArray(recipesEntity)) {
        await Promise.all(recipesEntity.map((recipe) => this.repository.create(recipe)));
      }

      await this.repository.create(recipesEntity);
    }
}
