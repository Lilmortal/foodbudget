import { PrismaClient, users } from '@prisma/client';
import { Repository } from '../../shared/types/Repository.types';

export default class UserRepository implements Repository<users> {
  private readonly prisma: PrismaClient;

  constructor(prisma: PrismaClient) {
    this.prisma = prisma;
  }
  // eslint-disable-next-line class-methods-use-this, lines-between-class-members, @typescript-eslint/no-unused-vars
  async getMany(user: Partial<users>): Promise<users[] | undefined> {
    return undefined;
  }

  async getOne(user: Partial<users>): Promise<users | undefined> {
    const result = await this.prisma.users.findOne({
      where: {
        id: user.id,
        email: user.email,
      },
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
        data: {
          email: user.email,
          nickname: user.nickname,
          password: user.password,
        },
      })));
    }
    return this.prisma.users.create({
      data: {
        email: usersEntity.email,
        nickname: usersEntity.nickname,
        password: usersEntity.password,
      },
    });
  }
}
