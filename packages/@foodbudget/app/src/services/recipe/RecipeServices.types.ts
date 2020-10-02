import Repository from '../../repository';
import { Recipe } from '../../repository/recipe';

export interface RecipeServicesParams {
    repository: Repository<Recipe>;
}

export interface RecipeServicesInterface {
    save(recipe: Recipe | Recipe[]): Promise<void>;
}
