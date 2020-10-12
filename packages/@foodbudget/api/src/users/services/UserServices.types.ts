import { users } from '@prisma/client';
import { Repository } from '../../shared/types/Repository.types';
import { User } from '../User.types';

export interface UserServicesParams {
    repository: Repository<User, users>;
}
