import { useQuery, gql, NormalizedCacheObject } from '@apollo/client';
import { GetStaticProps } from 'next';
import { useState } from 'react';
import Button from '../components/Button';
import PageTemplate from '../templates/page';
import { initializeApollo } from './lib/client';
import { IngredientEdge, Maybe, Query } from './__generated__/schema';

const ingredientQuery = gql`
  query IngredientQuery($first: Int, $last: Int, $before: ID, $after: ID) {
    ingredients(first: $first, last: $last, before: $before, after: $after) {
      edges {
        cursor
        node {
          name
          price {
            amount
            currency
          }
        }
      }
      pageInfo {
        startCursor
        hasPreviousPage
        hasNextPage
        endCursor
      }
    }
  }
`;

const App: React.FC<{}> = () => {
  // const { data, loading, error, fetchMore } = useQuery<Query>(ingredientQuery);
  // const [cursor, setCursor] = useState(data?.ingredients?.pageInfo?.endCursor);
  const [hmm] = useState('test');

  // const handleIngredientFetch = async () => {
  //   const { data: updatedData } = await fetchMore({ variables: { last: 1, after: cursor } });
  //   setCursor(updatedData?.ingredients?.pageInfo?.endCursor);
  // };

  // if (loading) {
  //   return <div>Loading...</div>;
  // }
  // if (error) {
  //   return <div>{error.message}</div>;
  // }

  return (
    //   <>
    //     <button onClick={handleIngredientFetch}>Fetch</button>
    //     {data?.ingredients?.edges?.map((edge: Maybe<IngredientEdge>) => <div key={edge?.cursor}>{edge?.node?.name}</div>)}
    //  </>
    <PageTemplate>
      <Button>Button button</Button>
    </PageTemplate>
  );
};

export default App;

interface IngredientOwnProps {
  initialApolloState: NormalizedCacheObject;
}

export const getStaticProps: GetStaticProps = async (): Promise<{
  props: IngredientOwnProps;
}> => {
  const apolloClient = initializeApollo();

  // await apolloClient.query({ query: ingredientQuery, variables: { last: 0 } });
  return {
    props: {
      initialApolloState: apolloClient.cache.extract(),
    },
  };
};
