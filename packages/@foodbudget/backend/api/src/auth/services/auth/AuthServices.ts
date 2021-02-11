import { AppError } from '@foodbudget/errors';
import argon2 from 'argon2';
import { Repository } from '../../../types/Repository';
import { User } from '../../../users';
import {
  AccountLoginRequest,
  FacebookLoginRequest,
  GoogleLoginRequest,
  LoginRequest,
} from './Auth.types';

interface AuthServicesInjection {
  readonly repository: Repository<User>;
}

export class AuthServices {
  private readonly repository: Repository<User>;

  constructor({ repository }: AuthServicesInjection) {
    this.repository = repository;
  }

  private isGoogleLoginRequest = (
    request: LoginRequest,
  ): request is GoogleLoginRequest =>
    (request as GoogleLoginRequest).googleId !== undefined;

  private isFacebookLoginRequest = (
    request: LoginRequest,
  ): request is FacebookLoginRequest =>
    (request as FacebookLoginRequest).facebookId !== undefined;

  private isAccountLoginRequest = (
    request: LoginRequest,
  ): request is AccountLoginRequest =>
    (request as AccountLoginRequest).email !== undefined &&
    (request as AccountLoginRequest).password !== undefined;

  private getUserEntity = (request: LoginRequest): Partial<User> => {
    if (this.isGoogleLoginRequest(request)) {
      return {
        googleId: request.googleId,
      };
    }
    if (this.isFacebookLoginRequest(request)) {
      return {
        facebookId: request.facebookId,
      };
    }
    if (this.isAccountLoginRequest(request)) {
      return {
        email: request.email,
      };
    }
    throw new AppError({
      message: 'login request is not valid.',
      isOperational: true,
    });
  };

  private isRequestCredentialsValid = async (
    request: LoginRequest,
    user: User,
  ): Promise<boolean> => {
    if (this.isAccountLoginRequest(request)) {
      if (
        !user.password ||
        !(await argon2.verify(user.password, request.password))
      ) {
        return false;
      }
    }

    return true;
  };

  private isRegisteringAnExistingAccountWithPassword = (
    userDto: Partial<User> | undefined,
    userEntity: User | undefined,
  ) => userDto?.password && userEntity?.password;

  async login(
    request: FacebookLoginRequest | GoogleLoginRequest,
  ): Promise<User>;

  async login(request: AccountLoginRequest): Promise<User | undefined>;

  async login(request: LoginRequest): Promise<User | undefined> {
    const userEntity = this.getUserEntity(request);

    const user = await this.repository.getOne(userEntity);

    if (user && (await this.isRequestCredentialsValid(request, user))) {
      return user;
    }

    if (
      this.isGoogleLoginRequest(request) ||
      this.isFacebookLoginRequest(request)
    ) {
      const registeredUser = await this.register(request);

      if (!registeredUser) {
        throw new AppError({
          message: `Attempting to register ${request.email} failed.`,
          isOperational: true,
        });
      }

      return registeredUser;
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
  async register(
    userDto: Partial<Omit<User, 'id'>> & Pick<User, 'email'>,
  ): Promise<User | undefined> {
    const user = await this.repository.getOne({ email: userDto.email });

    if (this.isRegisteringAnExistingAccountWithPassword(userDto, user)) {
      return undefined;
    }

    const userEntity: Omit<User, 'id'> = {
      ...userDto,
      password: userDto.password
        ? await argon2.hash(userDto.password)
        : undefined,
    };

    const createdUser = await this.repository.save(userEntity);
    return createdUser;
  }
}
