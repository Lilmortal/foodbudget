import { fetchQuery, graphql } from 'react-relay';
import { useFragment } from 'react-relay/hooks';
import { initEnvironment } from './lib/environment';

const query = graphql`
  query UserQuery($email: String) {
    User(email: $email) {
      ... on User {
        ...UserFragment_user
      }
    }
  }
`;

const userFragment = graphql`
  fragment UserFragment_user on User {
    email
    nickname
  }
`;

const Test: React.FC<{
  node: any,
}> = ({ node }) => {
  const result = useFragment(userFragment, node);

  return (
    <>
      {result && (<div>{result.email} {result.nickname}</div>)}
   </>
  );
};

const App: React.FC<{}> = ({ user }: any) => {
  const node = user.User;

  return (
    <>
      {node && <Test node={node} />}
    </>
  );
};

export default App;

export const getStaticProps = async () => {
  const environment = initEnvironment();

  const user = await fetchQuery(environment, query, { email: 'jacktan165@gmail.com' });

  return {
    props: {
      user,
      data: environment.getStore().getSource().toJSON(),
    },
  };
};
