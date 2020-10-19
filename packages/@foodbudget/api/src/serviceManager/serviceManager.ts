import { PrismaClient } from '@prisma/client';
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

const serviceManager: ServiceManager = {
  recipeServices,
  userServices,
  ingredientServices,
};

export default serviceManager;
