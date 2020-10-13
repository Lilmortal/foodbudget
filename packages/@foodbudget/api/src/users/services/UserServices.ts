import { users } from '@prisma/client';
import argon2 from 'argon2';
import { Repository } from '../../shared/types/Repository.types';
import { User } from '../User.types';
import { UserServicesParams } from './UserServices.types';

const mapUser = (userEntity: users): User => {
  const user: User = {
    id: userEntity.id,
    email: userEntity.email,
    nickname: userEntity.nickname || undefined,
  };

  return user;
};

interface GoogleLoginRequest {
  googleId: string;
}

interface AccountLoginRequest {
  email: string;
  password: string;

}

type LoginRequest = GoogleLoginRequest | AccountLoginRequest;

const isGoogleLoginRequest = (request: LoginRequest)
: request is GoogleLoginRequest => (request as GoogleLoginRequest).googleId !== undefined;

const isAccountLoginRequest = (request: LoginRequest)
: request is AccountLoginRequest => (request as AccountLoginRequest).email !== undefined
&& (request as AccountLoginRequest).password !== undefined;

export default class UserServices {
    private readonly repository: Repository<users>;

    constructor({ repository }: UserServicesParams) {
      this.repository = repository;
    }

    async get(userEntity: Pick<Partial<users>, 'id' | 'email'>): Promise<User | undefined> {
      const user = await this.repository.getOne(userEntity);

      if (user) {
        return mapUser(user);
      }
      return user;
    }

    async login(request: LoginRequest): Promise<User | undefined> {
      let userEntity: Partial<users>;

      if (isGoogleLoginRequest(request)) {
        userEntity = {
          google_id: request.googleId,
        };
      } else if (isAccountLoginRequest(request)) {
        const hashedPassword = await argon2.hash(request.password);

        userEntity = {
          email: request.email,
          password: hashedPassword,
        };
      } else {
        return undefined;
      }

      const user = await this.repository.getOne(userEntity);

      if (user) {
        return mapUser(user);
      }

      return user;
    }

    async register(userDto: Partial<Omit<users, 'id'>> & Pick<users, 'email'>): Promise<User> {
      const userEntity: Omit<users, 'id'> = {
        email: userDto.email,
        google_id: userDto.google_id || null,
        nickname: userDto.nickname || null,
        password: null,
      };

      if (userDto.password) {
        const hashedPassword = await argon2.hash(userDto.password);
        userEntity.password = hashedPassword;
      }

      const user = await this.repository.create(userEntity);

      return mapUser(user);
    }

    async update(updatedUserEntity: Omit<Partial<users>, 'id'> & Pick<users, 'email'>): Promise<User> {
      const userEntity: Omit<Partial<users>, 'id'> = {
        email: updatedUserEntity.email,
      };

      if (updatedUserEntity.nickname) {
        userEntity.nickname = updatedUserEntity.nickname;
      }

      if (updatedUserEntity.password) {
        const hashedPassword = await argon2.hash(updatedUserEntity.password);
        userEntity.password = hashedPassword;
      }

      const user = await this.repository.update(userEntity);

      return mapUser(user);
    }
}
