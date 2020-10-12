import { PrismaClient, users } from '@prisma/client';
import { Repository } from '../../shared/types/Repository.types';
import { User } from '../User.types';

export default class UserRepository implements Repository<User, users> {
  private readonly prisma: PrismaClient;

  constructor(prisma: PrismaClient) {
    this.prisma = prisma;
  }
  // eslint-disable-next-line class-methods-use-this, lines-between-class-members, @typescript-eslint/no-unused-vars
  async getMany(obj: Partial<User>): Promise<users[] | undefined> {
    return undefined;
  }

  async getOne(user: Partial<User>): Promise<users | undefined> {
    const result = await this.prisma.users.findOne({
      where: {
        email: user.email,
      },
    });

    if (result === null) {
      return undefined;
    }

    return result;
  }

  async create(usersDTO: User | User[]): Promise<void> {
    if (Array.isArray(usersDTO)) {
      await Promise.all(usersDTO.map(async (user) => {
        await this.prisma.users.create({
          data: {
            password: '',
            email: user.email,
            nickname: '',
          },
        });
      }));
    } else {
      await this.prisma.users.create({
        data: {
          password: '',
          email: usersDTO.email,
          nickname: '',
        },
      });
    }
  }
}
