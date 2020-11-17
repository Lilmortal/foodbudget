import { users } from '@prisma/client';
import { Mapper } from '../../types/Mapper';
import { User } from '../User.types';

export const userMapper: Mapper<User, users> = ({
  fromDto: (dto: User): users => ({
    id: parseInt(dto.id, 10),
    google_id: dto.googleId || null,
    facebook_id: dto.facebookId || null,
    email: dto.email,
    nickname: dto.nickname || null,
    password: dto.password || null,
    allergies: dto.allergies || [],
    diets: dto.diets || [],
  }),
  toDto: (entity: users): User => ({
    id: entity.id.toString(),
    googleId: entity.google_id || undefined,
    facebookId: entity.facebook_id || undefined,
    email: entity.email,
    nickname: entity.nickname || undefined,
    password: entity.password || undefined,
    allergies: entity.allergies,
    diets: entity.diets,
  }),
});
