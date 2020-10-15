import { PrismaClient, users } from '@prisma/client';
import { Repository } from '../../shared/types/Repository.types';
import { User } from '../User.types';

export default class UserRepository implements Repository<User, users> {
  private readonly prisma: PrismaClient;

  constructor(prisma: PrismaClient) {
    this.prisma = prisma;
  }

  // Will come handy in future with the release of friends list
  // eslint-disable-next-line class-methods-use-this, lines-between-class-members, @typescript-eslint/no-unused-vars
  async getMany(user: Partial<User>): Promise<users[] | undefined> {
    return undefined;
  }

  async getOne(user: Partial<User>): Promise<users | undefined> {
    const result = await this.prisma.users.findOne({
      where: user,
    });

    if (result === null) {
      return undefined;
    }

    return result;
  }

  async create(usersDto: User): Promise<users>;

  async create(usersDto: User[]): Promise<users[]>;

  async create(usersDto: User | User[]): Promise<users | users[]> {
    if (Array.isArray(usersDto)) {
      return Promise.all(usersDto.map(async (user) => this.prisma.users.create({
        data: user,
      })));
    }

    return this.prisma.users.create({
      data: usersDto,
    });
  }

  async update(usersDto: Partial<User> & Pick<User, 'email'>): Promise<users>;

  async update(usersDto: (Partial<User> & Pick<User, 'email'>)[]): Promise<users[]>;

  async update(usersDto: Partial<User> & Pick<User, 'email'>
  | (Partial<User> & Pick<User, 'email'>)[]): Promise<users | users[]> {
    if (Array.isArray(usersDto)) {
      return Promise.all(usersDto.map(async (user) => this.prisma.users.update({
        data: user,
        where: {
          email: user.email,
        },
      })));
    }

    return this.prisma.users.update({
      data: usersDto,
      where: {
        email: usersDto.email,
      },
    });
  }

  async delete(ids: number): Promise<users>;

  async delete(ids: number[]): Promise<users[]>;

  async delete(ids: number | number[]): Promise<users | users[]> {
    if (Array.isArray(ids)) {
      return Promise.all(ids.map(async (id) => this.prisma.users.delete({
        where: {
          id,
        },
      })));
    }

    return this.prisma.users.delete({
      where: {
        id: ids,
      },
    });
  }
}
