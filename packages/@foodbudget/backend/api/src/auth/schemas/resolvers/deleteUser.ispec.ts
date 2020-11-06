import { PrismaClient } from '@prisma/client';
import { gql } from 'apollo-server-express';
import findUp from 'find-up';
import { createTestApolloServer, createTestDatabase, tearDownTestDatabase } from '../../../utils/test';

describe('delete user', () => {
  let prismaClient: PrismaClient;

  beforeEach(async () => {
    const nodeModulesPath = await findUp('node_modules', { type: 'directory' });

    if (!nodeModulesPath) {
      throw new Error('could not find the closest node_modules.');
    }

    prismaClient = createTestDatabase(nodeModulesPath);
  });

  afterEach(async () => {
    await tearDownTestDatabase(prismaClient);
  });

  it('should delete user', async () => {
    const { mutate } = createTestApolloServer(prismaClient);

    const email = 'test@gmail.com';

    const registeredUser = await mutate({
      mutation: gql`
        mutation register($email: Email!, $password: String!) {
          register(email: $email, password: $password) {
            email
            nickname
          }
        }
      `,
      variables: { email, password: 'password123' },
    });

    expect(registeredUser.data?.register?.email).toEqual(email);

    const res = await mutate({
      mutation: gql`
        mutation deleteUser($email: Email!) {
          deleteUser(email: $email) {
            email
            nickname
          }
        }
      `,
      variables: { email },
    });

    expect(res.data?.deleteUser).toEqual({ email, nickname: null });
  });
});
