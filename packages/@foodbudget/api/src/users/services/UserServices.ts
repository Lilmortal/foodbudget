import { users } from '@prisma/client';
import argon2 from 'argon2';
import { Repository } from '../../shared/types/Repository.types';
import { User } from '../User.types';
import { UserServicesParams } from './UserServices.types';

const mapUser = (userEntity: users): User => {
  const user: User = {
    id: userEntity.id,
    googleId: userEntity.google_id || undefined,
    email: userEntity.email,
    nickname: userEntity.nickname || undefined,
    // @TODO: Remove
    password: userEntity.password || undefined,
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
        userEntity = {
          email: request.email,
        };
      } else {
        return undefined;
      }

      const user = await this.repository.getOne(userEntity);

      if (user) {
        if (isAccountLoginRequest(request)) {
          if (user.password) {
            const isValidPassword = await argon2.verify(user.password, request.password);

            if (!isValidPassword) {
              return undefined;
            }
          } else {
            return undefined;
          }
        }

        return mapUser(user);
      }

      return user;
    }

    async register(userDto: Partial<Omit<users, 'id'>> & Pick<users, 'email'>): Promise<User | undefined> {
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

      const user = await this.repository.getOne({ email: userDto.email });

      if (!user) {
        const createdUser = await this.repository.create(userEntity);
        return mapUser(createdUser);
      }
      // User has created an account via social auth but have not created an account manually.
      if (!user.password) {
        const updatedUser = await this.repository.update(userEntity);
        return mapUser(updatedUser);
      }

      return undefined;
    }

    async update(userDto: Omit<Partial<users>, 'id'> & Pick<users, 'email'>): Promise<User> {
      const userEntity: Omit<Partial<users>, 'id'> = {
        email: userDto.email,
      };

      if (userDto.nickname) {
        userEntity.nickname = userDto.nickname;
      }

      if (userDto.password) {
        const hashedPassword = await argon2.hash(userDto.password);
        userEntity.password = hashedPassword;
      }

      const user = await this.repository.update(userEntity);

      return mapUser(user);
    }

    async delete(userDto: Pick<users, 'id'>): Promise<boolean> {
      // @TODO: Send a one off cron job to delete the user in 5 days.
      // But for now, delete the user straight away.

      const user = await this.repository.delete(userDto);

      if (!user) {
        return false;
      }

      return true;
    }
}
