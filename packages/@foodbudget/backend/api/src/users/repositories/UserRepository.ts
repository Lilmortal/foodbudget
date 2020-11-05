import logger from '@foodbudget/logger';
import { PrismaClient } from '@prisma/client';
import { AppError } from '@foodbudget/errors';
import { User } from '../User.types';
import { userMapper } from './userMapper';
import { performanceTest } from '../../perf';
import { Repository } from '../../types/Repository';
import { PartialBy } from '../../types/PartialBy';
import { SaveOptions } from '../../types/SaveOptions';

export class UserRepository implements Repository<User> {
  private readonly prisma: PrismaClient;

  constructor(prisma: PrismaClient) {
    this.prisma = prisma;
  }

  async get(user: Partial<User>): Promise<User[] | undefined> {
    logger.info('get users repository request', user);
    performanceTest.start('get users');

    const results = await this.prisma.users.findMany({
      where: {
        id: user.id,
        email: user.email,
        google_id: user.googleId,
        facebook_id: user.facebookId,
      },
    });

    performanceTest.end('get users');

    if (results.length > 1) {
      throw new AppError({ message: 'Multiple users found.', isOperational: true, httpStatus: 500 });
    }

    if (results === null) {
      logger.info('no user found');
      return undefined;
    }

    logger.info('users retrieved', results);
    return results.map((result) => userMapper.toDto(result));
  }

  async getOne(user: Partial<User>): Promise<User | undefined> {
    logger.info('get one user repository request', user);
    performanceTest.start('get user');

    const result = await this.prisma.users.findOne({
      where: {
        id: user.id,
        email: user.email,
        google_id: user.googleId,
        facebook_id: user.facebookId,
      },
    });

    performanceTest.start('get user');

    if (result === null) {
      logger.info('no user found');
      return undefined;
    }

    logger.info('user retrieved', result);

    return userMapper.toDto(result);
  }

  private readonly upsert = async (user: PartialBy<User, 'id'>, override = false) => {
    const overrideOrUpdate = (
      shouldUpdate: boolean, value: Record<string, unknown>,
    ) => (override ? value : shouldUpdate && value);

    const result = await this.prisma.users.upsert({
      create: {
        email: user.email,
        password: user.password,
        nickname: user.nickname,
        google_id: user.googleId,
        facebook_id: user.facebookId,
      },
      update: {
        ...overrideOrUpdate(!!user.nickname, { nickname: user.nickname }),
        ...overrideOrUpdate(!!user.password, { password: user.password }),
        ...overrideOrUpdate(!!user.googleId, { google_id: user.googleId }),
        ...overrideOrUpdate(!!user.facebookId, { facebook_id: user.facebookId }),
      },
      where: {
        id: user.id,
        email: user.email,
      },
    });

    logger.info('user upserted', result);

    return result;
  };

  async save(usersDto: PartialBy<User, 'id'>, options?: SaveOptions): Promise<User>;

  async save(usersDto: PartialBy<User, 'id'>[], options?: SaveOptions): Promise<User[]>;

  async save(usersDto: PartialBy<User, 'id'> | PartialBy<User, 'id'>[], options?: SaveOptions): Promise<User | User[]> {
    if (Array.isArray(usersDto)) {
      performanceTest.start('save users');
      const results = await Promise.all(
        usersDto.map(async (user) => userMapper.toDto(await this.upsert(user, !!options?.override))),
      );

      performanceTest.end('save users');
      return results;
    }

    performanceTest.start('save user');
    const result = await userMapper.toDto(await this.upsert(usersDto));

    performanceTest.end('save user');
    return result;
  }

  async delete(ids: string): Promise<User>;

  async delete(ids: string[]): Promise<User[]>;

  async delete(ids: string | string[]): Promise<User | User[]> {
    logger.info('delete user repository request', ids);

    if (Array.isArray(ids)) {
      performanceTest.start('delete users');
      const results = await Promise.all(ids.map(async (id) => {
        if (isNaN(Number(id))) {
          throw new AppError({ message: 'Given user ID is not a number.', isOperational: true, httpStatus: 500 });
        }

        return userMapper.toDto(await this.prisma.users.delete({
          where: {
            id: Number(id),
          },
        }));
      }));

      performanceTest.end('delete users');
      return results;
    }

    if (isNaN(Number(ids))) {
      throw new AppError({ message: 'Given user ID is not a number.', isOperational: true, httpStatus: 500 });
    }

    performanceTest.start('delete user');
    const result = await this.prisma.users.delete({
      where: {
        id: Number(ids),
      },
    });
    performanceTest.end('delete user');

    logger.info('user deleted', result);

    return userMapper.toDto(result);
  }
}
