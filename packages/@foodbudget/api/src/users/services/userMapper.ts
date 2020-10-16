import { users } from '@prisma/client';
import Mapper from '../../shared/types/Mapper.types';
import { User } from '../User.types';

const userMapper: Mapper<User, users> = ({
  fromDto: (dto: User): users => ({
    id: dto.id,
    google_id: dto.googleId || null,
    facebook_id: dto.facebookId || null,
    email: dto.email,
    nickname: dto.nickname || null,
    password: dto.password || null,
  }),
  toDto: (entity: users): User => ({
    id: entity.id,
    googleId: entity.google_id || undefined,
    facebookId: entity.facebook_id || undefined,
    email: entity.email,
    nickname: entity.nickname || undefined,
    password: entity.password || undefined,

  }),
});

export default userMapper;
