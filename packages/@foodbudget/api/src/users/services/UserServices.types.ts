import { users } from '@prisma/client';
import { Repository } from '../../shared/types/Repository.types';
import { User } from '../User.types';

export interface UserServicesParams {
    repository: Repository<User, users>;
}

export interface GoogleLoginRequest {
    googleId: string;
  }

export interface FacebookLoginRequest {
    facebookId: string;
  }
export interface AccountLoginRequest {
    email: string;
    password: string;
  }

export type LoginRequest = GoogleLoginRequest | FacebookLoginRequest | AccountLoginRequest;
