import { recipes } from '@prisma/client';
import { Repository } from '../../shared/types/Repository.types';
import { Recipe } from '../Recipe.types';
import { RecipeServicesParams } from './RecipeServices.types';
import recipeMapper from './recipeMapper';

export default class RecipeServices {
    private readonly repository: Repository<Recipe, recipes>;

    constructor({ repository }: RecipeServicesParams) {
      this.repository = repository;
    }

    async get(recipeDto: Partial<Recipe>): Promise<Recipe[] | undefined> {
      const recipeEntities = await this.repository.getMany(recipeDto);
      if (recipeEntities) {
        return Promise.all(recipeEntities.map((recipe) => recipeMapper.toDto(recipe)));
      }
      return undefined;
    }

    async save(recipesDto: Omit<Recipe, 'id'>): Promise<Omit<Recipe, 'id'>>;

    async save(recipesDto: Omit<Recipe, 'id'>[]): Promise<Omit<Recipe, 'id'>[]>;

    async save(recipesDto: Omit<Recipe, 'id'> | Omit<Recipe, 'id'>[]): Promise<Omit<Recipe, 'id'> |Omit<Recipe, 'id'>[]>;

    async save(recipesDto: Omit<Recipe, 'id'> | Omit<Recipe, 'id'>[]): Promise<Omit<Recipe, 'id'> | Omit<Recipe, 'id'>[]> {
      if (Array.isArray(recipesDto)) {
        return Promise.all(recipesDto.map(async (recipe) => {
          const recipeEntity = await this.repository.create(recipe);
          return recipeMapper.toDto(recipeEntity);
        }));
      }
      const recipeEntity = await this.repository.create(recipesDto);
      return recipeMapper.toDto(recipeEntity);
    }
}
