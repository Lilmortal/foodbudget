import { AuthServices, TokenServices } from '../auth/services';
import { IngredientServices } from '../ingredients/services';
import { RecipeServices } from '../recipes/services';
import { UserServices } from '../users/services';

export interface ServiceManager {
    recipeServices: Required<RecipeServices>;
    userServices: Required<UserServices>;
    ingredientServices: Required<IngredientServices>;
    authServices: Required<AuthServices>;
    tokenServices: Required<TokenServices>;
}
