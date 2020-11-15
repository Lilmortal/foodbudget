import { fetchQuery, graphql } from 'react-relay';
import { useRefetchable } from 'relay-hooks';
import { initEnvironment } from './lib/environment';

const query = graphql`
  query IngredientQuery(
    $first: Int, 
    $last: Int,
    $before: ID,
    $after: ID
    ) {
    ingredients {
      ... on pagination {
        ...IngredientFragment_pagination @arguments(
        first: $first, 
        last: $last, 
        before: $before, 
        after: $after
        )
      }
    }
  }
`;

// buildConnectionMetadata

const ingredientFragment = graphql`
  fragment IngredientFragment_pagination on pagination 
  @refetchable(queryName: "IngredientsPaginationRefetchQuery") 
  @argumentDefinitions(
    first: {type: "Int"}
    last: {type: "Int"}
    before: {type: "ID"}
    after: {type: "ID"}
  ) {
    paginate(
      first: $first
      last: $last
      before: $before
      after: $after,
    ) {
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

const Test: React.FC<{
  node: any,
}> = ({ node }) => {
  const [result, refetch] = useRefetchable(ingredientFragment, node.ingredients);

  return (
    <>
      <button onClick={() => refetch({ last: 2, cursor: 'aW5ncmVkaWVudDI=', id: 1 })}>Fetch</button>
      {result.paginate.edges.map((edge: any) => <div key={edge.cursor}>{edge.node.name}</div>)}
   </>
  );
};

const App: React.FC<{}> = ({ ingredientsResult }: any) => {
  const node = ingredientsResult;

  return (
    <>
      {node && <Test node={node} />}
    </>
  );
};

export default App;

export const getStaticProps = async () => {
  const environment = initEnvironment();

  const ingredientsResult = await fetchQuery(environment, query, { last: 1 });

  return {
    props: {
      ingredientsResult,
      data: environment.getStore().getSource().toJSON(),
    },
  };
};
