// TODO
import { ingredients, PrismaClient, users } from '@prisma/client';
import { ServiceManager } from './serviceManager.types';
import RecipeServices from '../recipes/services';
import { Repository } from '../shared/types/Repository.types';
import { RepositoryError, ServiceError } from '../shared/errors';
import RecipeRepository from '../recipes/repositories';
import UserRepository from '../users/repositories';
import UserServices from '../users/services';
import { User } from '../users';
import { Recipe } from '../recipes';
import { Ingredient } from '../ingredients';
import IngredientRepository from '../ingredients/repositories';
import IngredientServices from '../ingredients/services';
import { RecipeResponse } from '../recipes/Recipe.types';

let userRepository: Repository<User, users>;
try {
  const prisma = new PrismaClient({ log: ['query'] });

  userRepository = new UserRepository(prisma);
} catch (err) {
  throw new RepositoryError(err);
}

let userServices: UserServices;
try {
  userServices = new UserServices(userRepository);
} catch (err) {
  throw new ServiceError(err);
}

let ingredientRepository: Repository<Ingredient, ingredients>;
try {
  const prisma = new PrismaClient({ log: ['query'] });

  ingredientRepository = new IngredientRepository(prisma);
} catch (err) {
  throw new RepositoryError(err);
}

let ingredientServices: IngredientServices;
try {
  ingredientServices = new IngredientServices(ingredientRepository);
} catch (err) {
  throw new ServiceError(err);
}

let recipeRepository: Repository<Recipe, RecipeResponse>;
try {
  const prisma = new PrismaClient({ log: ['query'] });

  recipeRepository = new RecipeRepository(prisma, ingredientServices);
} catch (err) {
  throw new RepositoryError(err);
}

let recipeServices: RecipeServices;
try {
  recipeServices = new RecipeServices(recipeRepository);
} catch (err) {
  throw new ServiceError(err);
}

const serviceManager: ServiceManager = {
  recipeServices,
  userServices,
  ingredientServices,
};

export default serviceManager;
