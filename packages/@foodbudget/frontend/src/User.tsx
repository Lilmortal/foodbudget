import { useState } from 'react';
import { fetchQuery, graphql } from 'react-relay';
import { useFragment, useRelayEnvironment } from 'react-relay/hooks';
import { useQuery, useRefetchable } from 'relay-hooks';
import { initEnvironment } from './lib/environment';
import { UserFragment_user, UserFragment_user$key } from './__generated__/UserFragment_user.graphql';
import { UserQuery, UserQueryResponse } from './__generated__/UserQuery.graphql';
// import { UserRefetchQuery } from './__generated__/UserRefetchQuery.graphql';

const query = graphql`
  query UserQuery($id: ID!) {
    node(id: $id) {
      ... on User {
        ...UserFragment_user
      }
    }
  }
`;

const userFragment = graphql`
  fragment UserFragment_user on User
  @refetchable(queryName: "UserRefetchQuery") {
    email
    nickname
  }
`;

const Test: React.FC<{
  node: any,
  setId: any
}> = ({ node, setId }) => {
  // I think useState is not the way to handle Relay store!
  // here, "node" is `const { props } = useQuery(query, { id }, { fetchPolicy: 'store-or-network' });` from
  // the App component below.
  // useRefetchable needs "node", or else it will complain. But "node" is hard coded to whatever the variable
  // `id` is. This whole thing is so confusing!
  // My ideal plan is to use `refetch` to update my result, not useState.
  const [result, refetch] = useRefetchable(userFragment, node);

  const environment = useRelayEnvironment();
  console.log(result, environment.getStore().getSource().toJSON());
  return (
    <>
      <button onClick={() => setId('24')}>Refetch</button>
      <button onClick={() => setId('23')}>Refetchmhmmm</button>
      {result && (<div>{result.email} {result.nickname}</div>)}
   </>
  );
};

const App: React.FC<{}> = () => {
  const [id, setId] = useState<string>('23');
  // fetchPolicy defaults to store-or-network, but I just added it in to emphasise it.
  const { props } = useQuery(query, { id }, { fetchPolicy: 'store-or-network' });

  return (
    <>
      {props?.node && <Test node={props.node} setId={setId} />}
    </>
  );
};

export default App;

export const getStaticProps = async () => {
  const environment = initEnvironment();

  // Fetch the result of id 23 and 24 and save it in the store before sending it to the client.
  await fetchQuery(environment, query, { id: 23 });
  await fetchQuery(environment, query, { id: 24 });

  return {
    props: {
      data: environment.getStore().getSource().toJSON(),
    },
  };
};
