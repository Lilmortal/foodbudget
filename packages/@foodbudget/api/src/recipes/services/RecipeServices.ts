import { recipes } from '@prisma/client';
import Repository from '../../types';
import { Recipe } from '../repository';
import { RecipeServicesInterface, RecipeServicesParams } from './RecipeServices.types';

export default class RecipeServices implements RecipeServicesInterface {
    #repository: Repository<Recipe, recipes>;

    constructor({ repository }: RecipeServicesParams) {
      this.#repository = repository;
    }

    async get(recipe: Partial<Recipe>): Promise<recipes[] | undefined> {
      return this.#repository.get(recipe);
    }

    async save(recipesDto: Recipe | Recipe[]): Promise<void> {
      if (Array.isArray(recipesDto)) {
        await Promise.all(recipesDto.map((recipe) => this.#repository.create(recipe)));
      }

      await this.#repository.create(recipesDto);
    }
}
