import {
  ApolloClient,
  InMemoryCache,
  NormalizedCacheObject,
} from '@apollo/client';
import { relayStylePagination } from '@apollo/client/utilities';
import { useMemo } from 'react';
import { HttpLink } from '@apollo/client/link/http';

const isServer = () => typeof window === 'undefined';

let apolloClient: ApolloClient<NormalizedCacheObject>;

// TODO: Handle server link
const createIsomorphicLink = () =>
  new HttpLink({ uri: 'http://localhost:8080/graphql' });

const createApolloClient = () =>
  new ApolloClient({
    link: createIsomorphicLink(),
    cache: new InMemoryCache({
      typePolicies: {
        Query: {
          fields: {
            ingredients: relayStylePagination(),
          },
        },
      },
    }),
    ssrMode: isServer(),
    connectToDevTools: true,
  });

export const initializeApollo = (
  initialState: NormalizedCacheObject | null = null,
): ApolloClient<NormalizedCacheObject> => {
  if (!apolloClient) {
    apolloClient = createApolloClient();

    if (initialState) {
      apolloClient.cache.restore(initialState);
    }
  }

  return apolloClient;
};

export const useApolloClient = (
  initialState: NormalizedCacheObject,
): ApolloClient<NormalizedCacheObject> => {
  const store = useMemo(() => initializeApollo(initialState), [initialState]);
  return store;
};
