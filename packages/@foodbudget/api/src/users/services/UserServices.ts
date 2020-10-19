import { users } from '@prisma/client';
import argon2 from 'argon2';
import { Repository } from '../../shared/types/Repository.types';
import { User } from '../User.types';
import userMapper from './userMapper';
import { LoginRequest } from './UserServices.types';
import {
  getUserEntity, isRegisteringExistedAccountViaPassword, isRequestCredentialsValid,
} from './UserServices.utils';

export default class UserServices {
  constructor(private readonly repository: Repository<User, users>) {
    this.repository = repository;
  }

  async get(userEntity: Pick<Partial<User>, 'id' | 'email'>): Promise<User | undefined> {
    const user = await this.repository.getOne(userEntity);

    if (user) {
      return userMapper.toDto(user);
    }
    return user;
  }

  async login(request: LoginRequest): Promise<User | undefined> {
    const userEntity = getUserEntity(request);

    if (!userEntity) {
      return undefined;
    }

    const user = await this.repository.getOne(userEntity);

    if (user && await isRequestCredentialsValid(request, user)) {
      return userMapper.toDto(user);
    }

    return undefined;
  }

  /**
    * Linking all viable means of logging.
    * For example, if user logged in via google before, and is now logging in via
    * facebook for the first time, link those two under the same account.
    *
    * @param userDto
  */
  async register(userDto: Partial<Omit<User, 'id'>> & Pick<User, 'email'>): Promise<User | undefined> {
    const user = await this.repository.getOne({ email: userDto.email });

    if (user && isRegisteringExistedAccountViaPassword(userDto, user)) {
      return undefined;
    }

    const userEntity: Omit<User, 'id'> = {
      ...userDto,
      password: userDto.password ? await argon2.hash(userDto.password) : undefined,
    };

    const createdUser = await this.repository.save(userEntity);
    return userMapper.toDto(createdUser);
  }

  async update(userDto: User): Promise<User> {
    const user = await this.repository.save({
      ...userDto,
      ...userDto.password && { password: await argon2.hash(userDto.password) },
    });

    return userMapper.toDto(user);
  }

  async delete(id: string): Promise<boolean> {
    // @TODO: Send a one off cron job to delete the user in 5 days.
    // But for now, delete the user straight away.

    const user = await this.repository.delete(id);

    if (!user) {
      return false;
    }

    return true;
  }
}
