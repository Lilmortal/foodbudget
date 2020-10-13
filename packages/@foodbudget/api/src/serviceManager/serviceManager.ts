import { PrismaClient, recipes, users } from '@prisma/client';
import { ServiceManager } from './serviceManager.types';
import RecipeServices from '../recipes/services';
import { Repository } from '../shared/types/Repository.types';
import { RepositoryError, ServiceError } from '../shared/errors';
import RecipeRepository from '../recipes/repositories';
import UserRepository from '../users/repositories';
import UserServices from '../users/services';

let recipeRepository: Repository<recipes>;
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

let userRepository: Repository<users>;
try {
  const prisma = new PrismaClient({ log: ['query'] });

  userRepository = new UserRepository(prisma);
} catch (err) {
  throw new RepositoryError(err);
}

let userServices: UserServices;
try {
  userServices = new UserServices({ repository: userRepository });
} catch (err) {
  throw new ServiceError(err);
}

const serviceManager: ServiceManager = {
  recipeServices,
  userServices,
};

export default serviceManager;
