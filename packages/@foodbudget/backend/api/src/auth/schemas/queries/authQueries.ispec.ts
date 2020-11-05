import { createTestClient } from 'apollo-server-testing';
import { ApolloServer, gql } from 'apollo-server-express';
import { sign } from 'jsonwebtoken';
import { CookieOptions } from 'express';
import { GraphQLError } from 'graphql';
import { schema } from '../../../schema';
import { serviceManager } from '../../../serviceManager';
import { TokenServices } from '../../services';

const mockAccessSecret = 'access key';
const mockRefreshSecret = 'secret key';
const expireTimeInMs = 5000000;

const tokenServices = new TokenServices(
  {
    tokenConfig: {
      access: {
        secret: mockAccessSecret,
        expireTimeInMs,
      },
      refresh: {
        secret: mockRefreshSecret,
        expireTimeInMs,
      },
    },
  },
);

describe('auth queries', () => {
  beforeEach(() => {
    jest.spyOn(global.Date, 'now').mockImplementation(() => 1604459767905);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should throw an error if refresh token does not exist', async () => {
    const server = new ApolloServer({
      schema,
      context: {
        serviceManager: {
          ...serviceManager,
          tokenServices,
        },
        req: {
          cookies: {
            [tokenServices.refreshTokenKey]: undefined,
          },
        },
      },
    });

    const { query } = createTestClient(server);

    const res = await query({ query:
      gql`
        query {
          renewToken
        }
      `,
    });

    expect(res.data).toEqual({ renewToken: null });
    expect(res.errors).toEqual([new GraphQLError('refresh token either expired or does not exist.')]);
  });

  it('should renew refresh token and return a refreshed access token', async () => {
    const mockCookieRes = jest.fn((name: string, value: string, option: CookieOptions) => ({ name, value, option }));
    const refreshToken = sign({ userId: '4', expireTimeInUtc: expireTimeInMs }, mockRefreshSecret);

    const server = new ApolloServer({
      schema,
      context: {
        serviceManager: {
          ...serviceManager,
          tokenServices,
        },
        req: {
          cookies: {
            [tokenServices.refreshTokenKey]: refreshToken,
          },
        },
        res: {
          cookie: mockCookieRes,
        },
        config: {
          env: 'development',
        },
      },
    });

    const { query } = createTestClient(server);

    const res = await query({ query:
      gql`
        query {
          renewToken
        }
      `,
    });

    expect(res.errors).toEqual(undefined);
    expect(res.data).toEqual(
      { renewToken: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI0Iiwic2NvcGUiOltdLCJleHBpcmVUaW1lSW5VdGM'
      + 'iOiJXZWQsIDA0IE5vdiAyMDIwIDA0OjM5OjI3IEdNVCIsImlhdCI6MTYwNDQ1OTc2NywiZXhwIjoxNjA0NDY0NzY3fQ.AG0s71uNvLl1'
      + 'DL12Agqsg94fL3WAKeWX8hIWix9QNNo' },
    );

    expect(mockCookieRes.mock.results[0].value).toEqual(
      { name: 'refresh-token',
        option: { expires: new Date('2020-11-04T04:39:27.905Z'), httpOnly: true, secure: false },
        value: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI0IiwiZXhwaXJlVGltZUluVXRjIjoiV2VkLCAwNCBOb3Yg'
        + 'MjAyMCAwNDozOToyNyBHTVQiLCJpYXQiOjE2MDQ0NTk3NjcsImV4cCI6MTYwNDQ2NDc2N30.8ch3-OEvwWAQxTvp_asMkMyejtAT8NJ'
        + '1U41-mINI_N0' },
    );
  });
});
