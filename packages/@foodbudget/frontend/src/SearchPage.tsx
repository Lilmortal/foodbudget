import { NormalizedCacheObject } from '@apollo/client';
import { GetStaticProps } from 'next';
import styled from 'styled-components';
import Button from '../components/Button';
import Dropdown from '../components/Dropdown';
import Textfield from '../components/Textfield';
import PageTemplate from '../templates/page';
import { initializeApollo } from './lib/client';

const SearchGrid = styled.div((props) => ({
  display: 'grid',
  gridTemplateColumns: '10% 1fr 10%',
  gridTemplateRows: '10% 1fr 30%',
  flexGrow: 1,

  ':before': {
    backgroundImage: 'none',

    [props.theme.breakpoints.md]: {
      content: `''`,
      width: '50%',
      height: '100%',
      backgroundSize: 'cover',
      backgroundImage: "url('/pizza.webp')",
      backgroundRepeat: 'no-repeat',
      position: 'absolute',
    },
  },

  [props.theme.breakpoints.md]: {
    gridTemplateColumns: '50% 2fr 1fr',
  },
}));

const SearchWrapper = styled.div({
  display: 'grid',
  gridColumn: 2,
  gridRow: 2,
  padding: '1rem',
  alignItems: 'center',
});

const Label = styled.label({
  display: 'flex',
  justifyContent: 'center',
  padding: '1rem',
});

const LabelTextfield = styled.div({
  display: 'flex',
  flexDirection: 'column',
});

const TextfieldWrapper = styled.div({
  display: 'flex',
  justifyContent: 'center',
});

const SubmitWrapper = styled.div({
  display: 'flex',
  justifyContent: 'center',
});

const TipWrapper = styled.div({
  display: 'flex',
  justifyContent: 'center',
});

const Tip = styled.h6({});

const App: React.FC<{}> = () => (
  <PageTemplate>
    <SearchGrid>
      <SearchWrapper>
        <LabelTextfield>
          <Label>My weekly budget</Label>
          <TextfieldWrapper>
            <Textfield type="text" />
          </TextfieldWrapper>
        </LabelTextfield>

        <LabelTextfield>
          <Label>I already have</Label>
          <TextfieldWrapper>
            <Dropdown values={['test', 'hmmm']} placeholder="ingredients" />
          </TextfieldWrapper>
        </LabelTextfield>

        <SubmitWrapper>
          <Button type="submit">Create weekly plan</Button>
        </SubmitWrapper>

        <TipWrapper>
          <Tip>Tip...</Tip>
        </TipWrapper>
      </SearchWrapper>
    </SearchGrid>
  </PageTemplate>
);

export default App;

interface IngredientOwnProps {
  initialApolloState: NormalizedCacheObject;
}

export const getStaticProps: GetStaticProps = async (): Promise<{
  props: IngredientOwnProps;
}> => {
  const apolloClient = initializeApollo();

  return {
    props: {
      initialApolloState: apolloClient.cache.extract(),
    },
  };
};
