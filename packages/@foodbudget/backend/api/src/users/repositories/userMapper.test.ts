import { users } from '@prisma/client';
import { User } from '../User.types';
import { userMapper } from './userMapper';

describe('user mapper', () => {
  it('should map user dto to entity', () => {
    const dto: User = {
      id: 1,
      googleId: '2',
      facebookId: '3',
      email: 'email',
      nickname: 'nickname',
      password: 'password',
      allergies: ['DIARY'],
      diets: ['KETOGENIC'],
    };

    const entity = userMapper.fromDto(dto);

    expect(entity).toEqual({
      id: 1,
      google_id: '2',
      facebook_id: '3',
      email: 'email',
      password: 'password',
      nickname: 'nickname',
      allergies: ['DIARY'],
      diets: ['KETOGENIC'],
    });
  });

  it('should map user entity to dto', () => {
    const entity: users = {
      id: 1,
      google_id: '2',
      facebook_id: '3',
      email: 'email',
      password: 'password',
      nickname: 'nickname',
      allergies: ['DIARY'],
      diets: ['KETOGENIC'],
    };

    const dto = userMapper.toDto(entity);

    expect(dto).toEqual({
      id: 1,
      googleId: '2',
      facebookId: '3',
      email: 'email',
      nickname: 'nickname',
      password: 'password',
      allergies: ['DIARY'],
      diets: ['KETOGENIC'],
    });
  });
});
