import { users } from '@prisma/client';
import argon2 from 'argon2';
import { User } from '../User.types';
import {
  AccountLoginRequest, FacebookLoginRequest, GoogleLoginRequest, LoginRequest,
} from './UserServices.types';

export const mapUserEntityToDto = (userEntity: users): User => {
  const user: User = {
    id: userEntity.id,
    googleId: userEntity.google_id || undefined,
    facebookId: userEntity.facebook_id || undefined,
    email: userEntity.email,
    nickname: userEntity.nickname || undefined,
    password: userEntity.password || undefined,
  };

  return user;
};

export const isGoogleLoginRequest = (request: LoginRequest)
  : request is GoogleLoginRequest => (request as GoogleLoginRequest).googleId !== undefined;

export const isFacebookLoginRequest = (request: LoginRequest)
  : request is FacebookLoginRequest => (request as FacebookLoginRequest).facebookId !== undefined;

export const isAccountLoginRequest = (request: LoginRequest)
  : request is AccountLoginRequest => (request as AccountLoginRequest).email !== undefined
  && (request as AccountLoginRequest).password !== undefined;

export const getUserEntity = (request: LoginRequest): Partial<User>|undefined => {
  let userEntity: Partial<User> | undefined;

  if (isGoogleLoginRequest(request)) {
    userEntity = {
      googleId: request.googleId,
    };
  } else if (isFacebookLoginRequest(request)) {
    userEntity = {
      facebookId: request.facebookId,
    };
  } else if (isAccountLoginRequest(request)) {
    userEntity = {
      email: request.email,
    };
  }
  return userEntity;
};

export const isRequestCredentialsValid = async (request: LoginRequest, user: users): Promise<boolean> => {
  if (isAccountLoginRequest(request)) {
    if (user.password && await argon2.verify(user.password, request.password)) {
      return true;
    }

    return false;
  }

  return true;
};

export const isRegisteringExistedAccountViaPassword = (
  userDto: Pick<User, 'googleId' | 'facebookId'>, user: users,
): boolean => !userDto.googleId && !userDto.facebookId && user.password !== undefined;