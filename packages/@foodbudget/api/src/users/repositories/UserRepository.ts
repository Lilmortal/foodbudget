import { PrismaClient, users } from '@prisma/client';
import { Repository } from '../../shared/types/Repository.types';

export default class UserRepository implements Repository<users> {
  private readonly prisma: PrismaClient;

  constructor(prisma: PrismaClient) {
    this.prisma = prisma;
  }

  // Will come handy in future with the release of friends list
  // eslint-disable-next-line class-methods-use-this, lines-between-class-members, @typescript-eslint/no-unused-vars
  async getMany(user: Partial<users>): Promise<users[] | undefined> {
    return undefined;
  }

  async getOne(user: Partial<users>): Promise<users | undefined> {
    const result = await this.prisma.users.findOne({
      where: user,
    });

    if (result === null) {
      return undefined;
    }

    return result;
  }

  async create(usersEntity: Omit<users, 'id'>): Promise<users>;

  async create(usersEntity: Omit<users, 'id'>[]): Promise<users[]>;

  async create(usersEntity: Omit<users, 'id'> | Omit<users, 'id'>[]): Promise<users | users[]> {
    if (Array.isArray(usersEntity)) {
      return Promise.all(usersEntity.map(async (user) => this.prisma.users.create({
        data: user,
      })));
    }

    return this.prisma.users.create({
      data: usersEntity,
    });
  }

  async update(usersEntity: Partial<users>): Promise<users>;

  async update(usersEntity: Partial<users>[]): Promise<users[]>;

  async update(usersEntity: Partial<users> | Partial<users>[]): Promise<users | users[]> {
    if (Array.isArray(usersEntity)) {
      return Promise.all(usersEntity.map(async (user) => this.prisma.users.update({
        data: user,
        where: {
          email: user.email,
        },
      })));
    }

    return this.prisma.users.update({
      data: usersEntity,
      where: {
        email: usersEntity.email,
      },
    });
  }

  async delete(usersEntity: Pick<users, 'id'>): Promise<users>;

  async delete(usersEntity: Pick<users, 'id'>[]): Promise<users[]>;

  async delete(usersEntity: Pick<users, 'id'> | Pick<users, 'id'>[]): Promise<users | users[]> {
    if (Array.isArray(usersEntity)) {
      return Promise.all(usersEntity.map(async (user) => this.prisma.users.delete({
        where: {
          id: user.id,
        },
      })));
    }

    return this.prisma.users.delete({
      where: {
        id: usersEntity.id,
      },
    });
  }
}
