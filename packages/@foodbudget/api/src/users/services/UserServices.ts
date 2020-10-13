import { users } from '@prisma/client';
import { Repository } from '../../shared/types/Repository.types';
import { User } from '../User.types';
import { UserServicesParams } from './UserServices.types';

export default class UserServices {
    private readonly repository: Repository<users>;

    constructor({ repository }: UserServicesParams) {
      this.repository = repository;
    }

    async getUser(userEntity: Pick<Partial<users>, 'id' | 'email'>): Promise<users | undefined> {
      const user = await this.repository.getOne(userEntity);

      return user;
    }

    async login(email: string): Promise<users | undefined> {
      const userEntity: User = {
        email,
      };

      const user = await this.repository.getOne(userEntity);

      return user;
    }

    async register(email: string): Promise<users> {
      const userEntity: Omit<users, 'id'> = {
        email,
        password: '',
        nickname: '',
      };

      const user = await this.repository.create(userEntity);

      return user;
    }
}
