import { recipes } from '@prisma/client';
import { Repository } from '../../shared/types/Repository.types';
import { Recipe } from '../repositories';

export interface RecipeServicesParams {
    repository: Repository<Recipe, recipes>;
}

export interface RecipeServicesInterface {
    get(recipe: Partial<Recipe>): Promise<recipes[] | undefined>;
    save(recipe: Recipe | Recipe[]): Promise<void>;
}
