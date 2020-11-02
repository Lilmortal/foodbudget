import { QueryRenderer } from 'react-relay';
import { Environment, Network, RecordSource, Store } from 'relay-runtime';
import userQuery from '../src/User';
import UserFragment from '../src/UserFragment';

function fetchQuery(operation: any, variables: any) {
  return fetch('http://localhost:8080/graphql', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      query: operation.text,
      variables,
    }),
  }).then((response) => response.json());
}

const environment = new Environment({
  network: Network.create(fetchQuery),
  store: new Store(new RecordSource()),
});

const App: React.FC<{}> = () => (
  <QueryRenderer
    environment={environment}
    query={userQuery}
    variables={{ email: 'jacktan165@gmail.com' }}
    render={({ error, props }: any) => {
      if (error) {
        return <div>Error!</div>;
      }
      if (!props) {
        return <div>Loading...</div>;
      }
      return <UserFragment {...props} />;
    }}
  />
);

export default App;
