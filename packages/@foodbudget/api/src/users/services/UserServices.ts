import { users } from '@prisma/client';
import argon2 from 'argon2';
import { Repository } from '../../shared/types/Repository.types';
import { User } from '../User.types';
import userMapper from './userMapper';
import { LoginRequest, UserServicesParams } from './UserServices.types';
import {
  getUserEntity, isRegisteringExistedAccountViaPassword, isRequestCredentialsValid,
} from './UserServices.utils';

export default class UserServices {
    private readonly repository: Repository<User, users>;

    constructor({ repository }: UserServicesParams) {
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

    async register(userDto: Partial<Omit<User, 'id'>> & Pick<User, 'email'>): Promise<User | undefined> {
      // Check if user exist
      const user = await this.repository.getOne({ email: userDto.email });

      // If it does not exist, create it
      if (!user) {
        const userEntity: Omit<User, 'id'> = {
          email: userDto.email,
          googleId: userDto.googleId,
          facebookId: userDto.facebookId,
          nickname: userDto.nickname,
          password: userDto.password ? await argon2.hash(userDto.password) : undefined,
        };

        const createdUser = await this.repository.create(userEntity);
        return userMapper.toDto(createdUser);
      }

      if (isRegisteringExistedAccountViaPassword(userDto, user)) {
        return undefined;
      }

      /**
       * Linking all viable means of logging.
       * For example, if user logged in via google before, and is now logging in via
       * facebook for the first time, link those two under the same account.
       */
      const updatedUserEntity: Partial<User> & Pick<User, 'email'> = {
        email: userDto.email,
        ...userDto.googleId && { google_id: userDto.googleId },
        ...userDto.facebookId && { facebook_id: userDto.facebookId },
        ...userDto.password && { password: await argon2.hash(userDto.password) },
      };

      const updatedUser = await this.repository.update(updatedUserEntity);
      return userMapper.toDto(updatedUser);
    }

    async update(userDto: Pick<Partial<User>, 'email' | 'nickname' | 'password'>): Promise<User> {
      const userEntity: Partial<User> = {
        email: userDto.email,
        ...userDto.nickname && { nickname: userDto.nickname },
        ...userDto.password && { password: await argon2.hash(userDto.password) },
      };

      const user = await this.repository.update(userEntity);

      return userMapper.toDto(user);
    }

    async delete(id: number): Promise<boolean> {
      // @TODO: Send a one off cron job to delete the user in 5 days.
      // But for now, delete the user straight away.

      const user = await this.repository.delete(id);

      if (!user) {
        return false;
      }

      return true;
    }
}
