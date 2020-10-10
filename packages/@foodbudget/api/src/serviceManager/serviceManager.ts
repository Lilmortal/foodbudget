import { PrismaClient, recipes } from '@prisma/client';
import { ServiceManager } from './serviceManager.types';
import RecipeServices from '../recipes/services';
import { Recipe, RecipeRepository } from '../recipes/repositories';
import { Repository } from '../shared/types/Repository.types';
import { RepositoryError, ServiceError } from '../shared/errors';

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
