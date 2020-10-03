import Repository from '../../types';
import { Recipe } from '../repository';
import { RecipeServicesInterface, RecipeServicesParams } from './RecipeServices.types';

export default class RecipeServices implements RecipeServicesInterface {
    #repository: Repository<Recipe>;

    constructor({ repository }: RecipeServicesParams) {
      this.#repository = repository;
    }

    async save(recipes: Recipe | Recipe[]): Promise<void> {
      if (Array.isArray(recipes)) {
        await Promise.all(recipes.map((recipe) => this.#repository.create(recipe)));
      }

      await this.#repository.create(recipes);
    }
}
