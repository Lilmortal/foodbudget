import { PrismaClient, recipes } from '@prisma/client';
import { RepositoryError, ServiceError } from '@foodbudget/errors';
import { ServiceManager } from './serviceManager.types';
import RecipeServices from '../recipes/services';
import { Recipe, RecipeRepository } from '../recipes/repository';
import Repository from '../types';

let recipeRepository: Repository<Recipe, recipes>;
try {
  const prisma = new PrismaClient({ log: ['query'] });

  recipeRepository = new RecipeRepository(prisma);
} catch (err) {
  throw new RepositoryError(err);
}

let recipeServices: RecipeServices;
try {
  recipeServices = new RecipeServices({ repository: recipeRepository });
} catch (err) {
  throw new ServiceError(err);
}

const serviceManager: ServiceManager = {
  recipeServices,
};

export default serviceManager;
