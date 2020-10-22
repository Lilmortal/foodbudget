import { Repository } from '../../shared/types/Repository.types';
import { Recipe, RecipeResponse } from '../Recipe.types';
import recipeMapper from '../recipeMapper';
import { PartialBy } from '../../shared/types/PartialBy.types';

export default class RecipeServices {
  constructor(private readonly repository : Repository<Recipe, RecipeResponse>) {
    this.repository = repository;
  }

  async get(recipeDto: Partial<Recipe>): Promise<Recipe[] | undefined> {
    const recipeEntities = await this.repository.get(recipeDto);
    if (recipeEntities && recipeEntities.length > 0) {
      return Promise.all(recipeEntities.map((recipe) => recipeMapper.toDto(recipe)));
    }
    return undefined;
  }

  async save(recipesDto: PartialBy<Recipe, 'id'>): Promise<Recipe>;

  async save(recipesDto: PartialBy<Recipe, 'id'>[]): Promise<Recipe[]>;

  async save(recipesDto: PartialBy<Recipe, 'id'> | PartialBy<Recipe, 'id'>[]): Promise<Recipe | Recipe[]>;

  async save(recipesDto: PartialBy<Recipe, 'id'> | PartialBy<Recipe, 'id'>[]): Promise<Recipe | Recipe[]> {
    if (Array.isArray(recipesDto)) {
      return Promise.all(recipesDto.map(async (recipe) => {
        const recipeEntity = await this.repository.save(recipe);
        return recipeMapper.toDto(recipeEntity);
      }));
    }

    const recipeEntity = await this.repository.save(recipesDto);

    return recipeMapper.toDto(recipeEntity);
  }
}
