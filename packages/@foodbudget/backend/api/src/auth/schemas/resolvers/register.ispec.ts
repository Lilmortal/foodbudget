import { PrismaClient } from '@prisma/client';
import { gql } from 'apollo-server-express';
import findUp from 'find-up';
import argon2 from 'argon2';
import { UserRepository } from '../../../users';
import {
  createTestApolloServer,
  createTestDatabase,
  tearDownTestDatabase,
} from '../../../utils/test';
import { AuthServices } from '../../services';

describe('register user', () => {
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

  it('should register an user', async () => {
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
  });

  it('should return null if email and password is already registered', async () => {
    const { mutate } = createTestApolloServer(prismaClient);

    const email = 'test@gmail.com';

    await mutate({
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

    expect(registeredUser.data?.register).toEqual(null);
  });

  it('should link a created account that registered via google with new password', async () => {
    const email = 'test@gmail.com';

    const userRepository = new UserRepository(prismaClient);
    const authServices = new AuthServices({ repository: userRepository });

    await authServices.register({
      googleId: '1',
      email,
    });

    const { mutate } = createTestApolloServer(prismaClient);

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
  });

  it('should link a created account that was registered via a form with google', async () => {
    const email = 'test@gmail.com';
    const password = 'password123';

    const { mutate } = createTestApolloServer(prismaClient);

    const registeredUser = await mutate({
      mutation: gql`
        mutation register($email: Email!, $password: String!) {
          register(email: $email, password: $password) {
            email
            nickname
          }
        }
      `,
      variables: { email, password },
    });

    expect(registeredUser.data?.register?.email).toEqual(email);

    const userRepository = new UserRepository(prismaClient);
    const authServices = new AuthServices({ repository: userRepository });

    const createdUser = await authServices.register({
      googleId: '1',
      email,
    });

    expect(createdUser?.googleId).toEqual('1');
    expect(await argon2.verify(createdUser?.password || '', password)).toEqual(
      true,
    );
  });
});
