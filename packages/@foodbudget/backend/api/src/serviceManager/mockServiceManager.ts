import { PrismaClient } from '@prisma/client';
import { AuthServices } from '../auth';
import { TokenServices } from '../auth/services/token/TokenServices';
import { config } from '../config';
import { IngredientRepository, IngredientServices } from '../ingredients';
import { RecipeRepository, RecipeServices } from '../recipes';
import { UserRepository, UserServices } from '../users';
import { ServiceManager } from './serviceManager.types';

// TODO: Think of a better name
export const mockServiceManager = (
  prismaClient: PrismaClient,
): ServiceManager => {
  const userRepository = new UserRepository(prismaClient);
  const userServices = new UserServices(userRepository);

  const ingredientRepository = new IngredientRepository(prismaClient);
  const ingredientServices = new IngredientServices(ingredientRepository);

  const recipeRepository = new RecipeRepository(
    prismaClient,
    ingredientServices,
  );
  const recipeServices = new RecipeServices(recipeRepository);

  const authServices = new AuthServices({ repository: userRepository });
  const tokenServices = new TokenServices({ tokenConfig: config.token });

  return {
    recipeServices,
    userServices,
    ingredientServices,
    authServices,
    tokenServices,
  };
};
