import { graphql, QueryRenderer } from 'react-relay';
import {
  Environment, Network, RecordSource, Store,
} from 'relay-runtime';

function fetchQuery(
  operation: any,
  variables: any,
) {
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

const UserFragment = graphql`
    fragment UserFragment on user {
        email
        nickname
    }
`;

const App: React.FC<{}> = () => (
    <QueryRenderer
    environment={environment}
    query={UserFragment}
    variables={{ email: 'jacktan165@gmail.com' }}
    render={({ error, props }: any) => {
      if (error) {
        return <div>Error!</div>;
      }
      if (!props) {
        return <div>Loading...</div>;
      }
      return <div>User ID: {props}</div>;
    }}
    />
);

export default App;
