import argon2 from 'argon2';
import { Repository } from '../../types/Repository';
import { User } from '../User.types';

export class UserServices {
  constructor(private readonly repository: Repository<User>) {
    this.repository = repository;
  }

  async get(userEntity: Pick<Partial<User>, 'id' | 'email'>): Promise<User | undefined> {
    const user = await this.repository.getOne(userEntity);

    if (user) {
      return user;
    }
    return user;
  }

  async update(userDto: User): Promise<User> {
    const user = await this.repository.save({
      ...userDto,
      ...userDto.password && { password: await argon2.hash(userDto.password) },
    });

    return user;
  }

  async delete(id: string): Promise<User> {
    // @TODO: Send a one off cron job to delete the user in 5 days.
    // But for now, delete the user straight away.

    const user = await this.repository.delete(id);

    return user;
  }
}
