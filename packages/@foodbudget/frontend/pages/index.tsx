import { useEffect, useState, useMemo, useCallback } from 'react';
import { fetchQuery, createFragmentContainer } from 'react-relay';
import {
  useQuery, graphql, usePreloadedQuery, useFragment,
  useRefetch, useRelayEnvironment, useLazyLoadQuery, loadQuery } from 'relay-hooks';
import { initEnvironment } from '../src/lib/environment';

const query = graphql`
  query UserQuery($email: Email!) {
    ...UserFragment_user
  }
`;

const userFragment = graphql`
  fragment UserFragment_user on user {
    user(email: $email) {
      email
      nickname
    }
  }
`;

const Test: React.FC<{queryReference: any}> = ({ queryReference }: any) => {
  // const loadedData = usePreloadedQuery(query, queryReference);
  // const result = useFragment(userFragment, queryReference.user);
  const [result, setTest] = useRefetch(userFragment, queryReference.user);

  // const prefetch = loadQuery();

  console.log('r', result);
  return (
    <>
        <button onClick={() => {
          const response = setTest(query, {
            email: 'jacktan1651@gmail.com' });
          return response;
        }}>Hmmm</button>
   {result && (<div>{result.email} {result.nickname}</div>)}
   </>
  );
};

const App: React.FC<{}> = () => {
  const [data, setData] = useState<any>();

  const [name, setName] = useState<string>();

  const { props } = useQuery(query, { email: 'jacktan165@gmail.com' });
  // const [test, setTest] = useRefetch(userFragment, props.user);

  // useEffect(() => {
  //   console.log('hhhhhh', test);
  // }, [test]);
  // console.log('ppp', props);
  // // const prefetch = loadQuery();
  // console.log('props', test);

  // useEffect(() => {
  //   loadQuery({ email: 'jacktan165@gmail.com' });
  // }, []);

  // const a = useLazyLoadQuery(query, { email: 'jacktfvfassn165@gmail.com' });

  return (
    <>
   <Test queryReference={props} />
   </>
  );
};

export default App;

export const getStaticProps = async () => {
  const environment = initEnvironment();

  // await fetchQuery(environment, query, {});
  await fetchQuery(environment, query, { email: 'jacktassn165@gmail.com' });
  await fetchQuery(environment, query, { email: 'jacktan165@gmail.com' });
  // await fetchQuery(environment, query, { email: 'jacktan1651@gmail.com' });

  return {
    props: {
      data: environment.getStore().getSource().toJSON(),
    },
  };
};
