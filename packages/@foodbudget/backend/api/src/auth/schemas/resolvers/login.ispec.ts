import { PrismaClient } from '@prisma/client';
import { gql } from 'apollo-server-express';
import { CookieOptions } from 'express';
import findUp from 'find-up';
import argon2 from 'argon2';
import { UserRepository } from '../../../users';
import { createTestApolloServer, createTestDatabase, tearDownTestDatabase } from '../../../utils/test';
import { AuthServices } from '../../services';
import { config } from '../../../config';

describe('login', () => {
  let prismaClient: PrismaClient;

  beforeEach(async () => {
    jest.spyOn(global.Date, 'now').mockImplementation(() => 1604459767905);

    const nodeModulesPath = await findUp('node_modules', { type: 'directory' });

    if (!nodeModulesPath) {
      throw new Error('could not find the closest node_modules.');
    }

    prismaClient = createTestDatabase(nodeModulesPath);
  });

  afterEach(async () => {
    jest.clearAllMocks();

    await tearDownTestDatabase(prismaClient);
  });

  it('should login', async () => {
    const mockCookieRes = jest.fn((name: string, value: string, option: CookieOptions) => ({ name, value, option }));

    const { mutate } = createTestApolloServer(prismaClient, {
      context: {
        res: {
          cookie: mockCookieRes,
        },
      },
    });

    const email = 'test@gmail.com';
    const password = 'password123';

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

    const res = await mutate({
      mutation: gql`
        mutation login($email: Email!, $password: String!) {
          login(email: $email, password: $password)
        }
      `,
      variables: { email, password },
    });

    expect(res.data?.login).toEqual('eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiIxIiwic2NvcGUiOl'
    + 'tdLCJleHBpcmVUaW1lSW5VdGMiOiJXZWQsIDA0IE5vdiAyMDIwIDAzOjMxOjA3IEdNVCIsImlhdCI6MTYwNDQ1OTc2NywiZXhw'
    + 'IjoxNjA0NDYwNjY3fQ.l0Q2xs7ApnNPJ8vSn9BxjvNDO4m8DxiwOX499IuI2Tc');

    expect(mockCookieRes.mock.results[0].value).toEqual(
      { name: 'refresh-token',
        option: { expires: new Date('2020-11-11T03:16:07.905Z'), httpOnly: true, secure: config.env === 'production' },
        value: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiIxIiwiZXhwaXJlVGltZUluVXRjIjoiV2VkLCAx'
        + 'MSBOb3YgMjAyMCAwMzoxNjowNyBHTVQiLCJpYXQiOjE2MDQ0NTk3NjcsImV4cCI6MTYwNTA2NDU2N30.29-UDOAvNRMZxK'
        + '9m6HpIMo-fIPfcBJVGtjgu1AuBz1g' },
    );
  });

  it('should fail if email is not registered', async () => {
    const mockCookieRes = jest.fn((name: string, value: string, option: CookieOptions) => ({ name, value, option }));

    const { mutate } = createTestApolloServer(prismaClient, {
      context: {
        res: {
          cookie: mockCookieRes,
        },
      },
    });

    const email = 'test@gmail.com';
    const password = 'password123';

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

    const res = await mutate({
      mutation: gql`
        mutation login($email: Email!, $password: String!) {
          login(email: $email, password: $password)
        }
      `,
      variables: { email: 'fakeemail@gmail.com', password },
    });

    expect(res.data?.login).toEqual(null);
  });

  it('should fail if password is incorrect', async () => {
    const mockCookieRes = jest.fn((name: string, value: string, option: CookieOptions) => ({ name, value, option }));

    const { mutate } = createTestApolloServer(prismaClient, {
      context: {
        res: {
          cookie: mockCookieRes,
        },
      },
    });

    const email = 'test@gmail.com';
    const password = 'password123';

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

    const res = await mutate({
      mutation: gql`
        mutation login($email: Email!, $password: String!) {
          login(email: $email, password: $password)
        }
      `,
      variables: { email, password: 'wrongpassword' },
    });

    expect(res.data?.login).toEqual(null);
  });

  it('should login via google', async () => {
    const userRepository = new UserRepository(prismaClient);
    const authServices = new AuthServices({ repository: userRepository });

    const user = await authServices.login({
      googleId: '1',
      email: 'test@gmail.com',
    });

    expect(user.googleId).toEqual('1');
    expect(user.email).toEqual('test@gmail.com');
    expect(user.password).toEqual(undefined);
  });

  it('should login via facebook', async () => {
    const userRepository = new UserRepository(prismaClient);
    const authServices = new AuthServices({ repository: userRepository });

    const user = await authServices.login({
      facebookId: '1',
      email: 'test@gmail.com',
    });

    expect(user.facebookId).toEqual('1');
    expect(user.email).toEqual('test@gmail.com');
    expect(user.password).toEqual(undefined);
  });

  it('should login via google for the first time even though the same email is registered', async () => {
    const mockCookieRes = jest.fn((name: string, value: string, option: CookieOptions) => ({ name, value, option }));

    const { mutate } = createTestApolloServer(prismaClient, {
      context: {
        res: {
          cookie: mockCookieRes,
        },
      },
    });

    const email = 'test@gmail.com';
    const password = 'password123';

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

    const user = await authServices.login({
      googleId: '1',
      email,
    });

    expect(user.googleId).toEqual('1');
    expect(user.email).toEqual('test@gmail.com');
    expect(await argon2.verify(user.password || '', password)).toEqual(true);
  });
});
