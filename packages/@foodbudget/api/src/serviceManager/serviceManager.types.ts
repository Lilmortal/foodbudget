import RecipeServices from '../recipes/services';
import UserServices from '../users/services';

export interface ServiceManager {
    recipeServices: Required<RecipeServices>;
    userServices: Required<UserServices>;
}
