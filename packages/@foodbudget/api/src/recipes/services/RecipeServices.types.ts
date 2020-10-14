import { recipes } from '@prisma/client';
import { Repository } from '../../shared/types/Repository.types';

export interface RecipeServicesParams {
    repository: Repository<recipes>;
}
