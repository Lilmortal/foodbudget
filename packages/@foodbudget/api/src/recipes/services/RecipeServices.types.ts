import { recipes } from '@prisma/client';
import { Repository } from '../../types/Repository.types';
import { Recipe } from '../repository';

export interface RecipeServicesParams {
    repository: Repository<Recipe, recipes>;
}

export interface RecipeServicesInterface {
    get(recipe: Partial<Recipe>): Promise<recipes[] | undefined>;
    save(recipe: Recipe | Recipe[]): Promise<void>;
}
