import { recipes } from '@prisma/client';
import { Repository } from '../../shared/types/Repository.types';
import { Recipe } from '../repositories';

export interface RecipeServicesParams {
    repository: Repository<Recipe, recipes>;
}
