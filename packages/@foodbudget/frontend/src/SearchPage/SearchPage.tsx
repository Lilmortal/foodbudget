import React, { useState } from 'react';
import { NormalizedCacheObject } from '@apollo/client';
import { GetStaticProps } from 'next';
import styled from 'styled-components';
import { useRouter } from 'next/router';
import * as yup from 'yup';

import Button from 'components/Button';
import Textfield from 'components/Textfield';
import AutoComplete from 'components/AutoComplete';
import { ErrorMessage, Form, Formik } from 'components/form';
import PageTemplate from '../templates/Page';
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
      backgroundImage: "url('/pizza.webp')",
      backgroundRepeat: 'no-repeat',
      display: 'grid',
      gridRow: '1/-1',
      gridColumn: 1,
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
  flexDirection: 'column',
});

const SubmitWrapper = styled.div({
  display: 'flex',
  justifyContent: 'center',
  padding: '2rem 0 0 0',
});

const TipWrapper = styled.div({
  display: 'flex',
  justifyContent: 'center',
  paddingTop: '2rem',
});

const Tip = styled.p({});

const PageForm = styled(Form)({
  display: 'flex',
  flexDirection: 'column',
  flexGrow: 1,
  justifyContent: 'space-evenly',
});

const removeItem = (list: string[], value: string) =>
  list.filter((item) => item !== value);

const schema = yup.object().shape({
  budget: yup
    .number()
    .required('Please enter your budget')
    .positive('Please enter a valid positive number')
    .typeError('Please enter a valid number'),
  ingredients: yup.array(),
});

export interface SearchPageProps {
  onSubmit(values: { budget: string; ingredients: string[] }): void;
  suggestions: string[];
}

export const SearchPage: React.FC<SearchPageProps> = ({
  onSubmit,
  suggestions,
}) => {
  const [ingredientList, setIngredientList] = useState<string[]>([]);

  const onIngredientClose = (
    element: React.SyntheticEvent<HTMLButtonElement, Event>,
  ) => {
    const value =
      element.currentTarget.textContent || element.currentTarget.innerText;

    if (ingredientList.includes(value)) {
      setIngredientList(removeItem(ingredientList, value));
    } else {
      throw new Error(
        `Attempt to close ingredient ${value} that is not found on the ingredient list.`,
      );
    }
  };

  return (
    <PageTemplate>
      <SearchGrid>
        <SearchWrapper>
          <Formik
            initialValues={{ budget: '', ingredients: [] }}
            validationSchema={schema}
            onSubmit={(values) => {
              onSubmit(values);
            }}
          >
            {({ isSubmitting, handleChange, setFieldValue }) => {
              const handleSelectedIngredient = (ingredient: string) => {
                if (!ingredientList.includes(ingredient)) {
                  setIngredientList([...ingredientList, ingredient]);
                  setFieldValue('ingredients', [...ingredientList, ingredient]);
                }
              };

              return (
                <PageForm>
                  <LabelTextfield>
                    <Label htmlFor="budget">My weekly budget</Label>
                    <TextfieldWrapper>
                      <Textfield
                        type="text"
                        id="budget"
                        data-cy="budgetInput"
                        onChange={handleChange}
                        placeholder="Place your budget in NZD"
                      />
                      <ErrorMessage name="budget" />
                    </TextfieldWrapper>
                  </LabelTextfield>

                  <LabelTextfield>
                    <Label htmlFor="ingredients">I already have</Label>
                    <TextfieldWrapper>
                      <AutoComplete
                        id="ingredients"
                        data-cy="ingredientsInput"
                        suggestions={suggestions}
                        onSuggestionSelect={handleSelectedIngredient}
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
                    <Button disabled={isSubmitting} type="submit">
                      Create weekly plan
                    </Button>
                  </SubmitWrapper>

                  {ingredientList.length === 0 && (
                    <TipWrapper>
                      <Tip>Tip...</Tip>
                    </TipWrapper>
                  )}
                </PageForm>
              );
            }}
          </Formik>
        </SearchWrapper>
      </SearchGrid>
    </PageTemplate>
  );
};

export interface SearchPageContainerProps {
  suggestions: string[];
}

const SearchPageContainer: React.FC<SearchPageContainerProps> = ({
  suggestions,
}) => {
  const router = useRouter();
  const onSubmit = (values: { budget: string; ingredients: string[] }) => {
    router.push({
      pathname: '/meal-plan',
      query: {
        budget: values.budget,
        ingredients: values.ingredients.join(','),
      },
    });
  };

  return <SearchPage onSubmit={onSubmit} suggestions={suggestions} />;
};

export default SearchPageContainer;

interface IngredientOwnProps {
  initialApolloState: NormalizedCacheObject;
  suggestions: string[];
}

export const getStaticProps: GetStaticProps = async (): Promise<{
  props: IngredientOwnProps;
}> => {
  const apolloClient = initializeApollo();

  const suggestions = [
    'test',
    'lala',
    'degr',
    'efgdg',
    'freg',
    'fregssss',
    'frgdxgt',
    'frrhrtht',
    'frdryhyhh',
    'Tex-Mex',
  ];

  return {
    props: {
      initialApolloState: apolloClient.cache.extract(),
      suggestions,
    },
  };
};
