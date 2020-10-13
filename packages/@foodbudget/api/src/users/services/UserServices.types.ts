import { users } from '@prisma/client';
import { Repository } from '../../shared/types/Repository.types';

export interface UserServicesParams {
    repository: Repository<users>;
}
