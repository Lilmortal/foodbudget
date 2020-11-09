import { Environment, Network, RecordSource, Store } from 'relay-runtime';

let relayEnvironment: Environment | undefined;

const fetchQuery = (
  operation: any, variables: any, cacheConfig: any, uploadables: any,
) => fetch('http://localhost:8080/graphql', {
  method: 'POST',
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    query: operation.text,
    variables,
  }),
}).then((response) => response.json());

const isServer = typeof window === 'undefined';

const createEnvironment = (records?: any) => {
  const store = new Store(new RecordSource(records));

  return new Environment({
    store,
    network: Network.create(fetchQuery),
  });
};

export const initEnvironment = (records?: any): Environment => {
  const environment = createEnvironment(records);

  if (isServer) {
    return environment;
  }

  if (!relayEnvironment) {
    relayEnvironment = environment;
  }
  return relayEnvironment;
};
