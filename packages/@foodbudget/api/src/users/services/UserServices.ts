import { users } from '@prisma/client';
import { Repository } from '../../shared/types/Repository.types';
import { User } from '../User.types';
import { UserServicesParams } from './UserServices.types';

export default class UserServices {
    private readonly repository: Repository<User, users>;

    constructor({ repository }: UserServicesParams) {
      this.repository = repository;
    }

    async login(email: string): Promise<void> {
      const user: Partial<User> = {
        email,
      };

      const results = await this.repository.getOne(user);

      if (!results) {
        throw new Error('could not find user.');
      }
    }

    async register(user: User): Promise<void> {
      await this.repository.create(user);
    }
}
