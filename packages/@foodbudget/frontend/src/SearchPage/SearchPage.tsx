import React, { useState } from 'react';
import { NormalizedCacheObject } from '@apollo/client';
import { GetStaticProps } from 'next';
import styled from 'styled-components';

import Button from '../../components/Button';
import Dropdown from '../../components/Dropdown';
import Textfield from '../../components/Textfield';
import PageTemplate from '../../templates/page';
import { initializeApollo } from '../lib/client';
import IngredientList from './IngredientList';

const SearchGrid = styled.div((props) => ({
  display: 'grid',
  gridTemplateColumns: '1fr 400px 1fr',
  gridTemplateRows: '20% 1fr 20%',
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
    gridTemplateColumns: '60% 400px 1fr',
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
  padding: '2rem 0 0 0',
});

const TipWrapper = styled.div({
  display: 'flex',
  justifyContent: 'center',
});

const Tip = styled.h6({});

const removeItem = (list: string[], value: string) =>
  list.filter((item) => item !== value);

const SearchPage: React.FC<{}> = () => {
  const [ingredientList, setIngredientList] = useState<string[]>([]);

  const onIngredientClose = (
    element: React.SyntheticEvent<HTMLButtonElement, Event>,
  ) => {
    const value = element.currentTarget.innerText;
    if (ingredientList.includes(value)) {
      setIngredientList(removeItem(ingredientList, value));
    } else {
      throw new Error(
        `Attempt to throw an ingredient ${value} that is not found on the ingredient list.`,
      );
    }
  };

  const onSelectIngredient = (
    element: React.SyntheticEvent<HTMLSelectElement, Event>,
  ) => {
    const ingredient = element.currentTarget.value;
    if (!ingredientList.includes(ingredient)) {
      setIngredientList([...ingredientList, ingredient]);
    }
  };

  return (
    <PageTemplate>
      <SearchGrid>
        <SearchWrapper>
          <LabelTextfield>
            <Label>My weekly budget</Label>
            <TextfieldWrapper>
              <Textfield type="text" placeholder="Place your budget in NZD" />
            </TextfieldWrapper>
          </LabelTextfield>

          <LabelTextfield>
            <Label>I already have</Label>
            <TextfieldWrapper>
              <Dropdown
                values={['test', 'hmmm']}
                clearValueOnSelect
                placeholder="ingredients"
                onSelect={onSelectIngredient}
              />
            </TextfieldWrapper>
          </LabelTextfield>

          {ingredientList.length > 0 && (
            <IngredientList
              header="Your ingredients"
              ingredients={ingredientList}
              onClose={onIngredientClose}
            />
          )}

          <SubmitWrapper>
            <Button type="submit">Create weekly plan</Button>
          </SubmitWrapper>

          {ingredientList.length === 0 && (
            <TipWrapper>
              <Tip>Tip...</Tip>
            </TipWrapper>
          )}
        </SearchWrapper>
      </SearchGrid>
    </PageTemplate>
  );
};

export default SearchPage;

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
