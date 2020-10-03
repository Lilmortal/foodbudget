import Repository from '../../types';
import { Recipe } from '../repository';

export interface RecipeServicesParams {
    repository: Repository<Recipe>;
}

export interface RecipeServicesInterface {
    save(recipe: Recipe | Recipe[]): Promise<void>;
}
