import { PrismaClient } from '@prisma/client';
import { AuthServices } from '../auth';
import { TokenServices } from '../auth/services/token/TokenServices';
import { config } from '../config';
import { IngredientRepository, IngredientServices } from '../ingredients';
import { RecipeRepository, RecipeServices } from '../recipes';
import { UserRepository, UserServices } from '../users';
import { ServiceManager } from './serviceManager.types';

const prisma = new PrismaClient({ log: ['query'] });

const userRepository = new UserRepository(prisma);
const userServices = new UserServices(userRepository);

const ingredientRepository = new IngredientRepository(prisma);
const ingredientServices = new IngredientServices(ingredientRepository);

const recipeRepository = new RecipeRepository(prisma, ingredientServices);
const recipeServices = new RecipeServices(recipeRepository);

const authServices = new AuthServices({ repository: userRepository });
const tokenServices = new TokenServices({ tokenConfig: config.token });

export const serviceManager: ServiceManager = {
  recipeServices,
  userServices,
  ingredientServices,
  authServices,
  tokenServices,
};
