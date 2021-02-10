import React, { useState } from 'react';
import { NormalizedCacheObject } from '@apollo/client';
import { GetStaticProps } from 'next';
import { useRouter } from 'next/router';
import * as yup from 'yup';
import classnames from 'classnames';
import Button from 'components/Button';
import Textfield from 'components/Textfield';
import { ErrorMessage, Form, Formik } from 'components/form';
import AutoComplete from 'components/AutoComplete';
import MainPage from '../templates/MainPage';
import { initializeApollo } from '../lib/client';
import IngredientList from './IngredientList';

import styles from './SearchPage.module.scss';

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

export interface SearchPageProps extends Styleable {
  onSubmit(values: { budget: string; ingredients: string[] }): void;
  suggestions: string[];
}

export const SearchPage: React.FC<SearchPageProps> = ({
  onSubmit,
  suggestions,
  className,
  style,
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
    <MainPage>
      <div className={styles.searchGrid}>
        <div className={styles.searchWrapper}>
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
                <Form
                  className={classnames(styles.form, className)}
                  style={style}
                >
                  <div className={styles.labelTextfield}>
                    <label className={styles.label} htmlFor="budget">
                      My weekly budget
                    </label>
                    <div className={styles.textfieldWrapper}>
                      <Textfield
                        type="text"
                        id="budget"
                        data-cy="budgetInput"
                        onChange={handleChange}
                        placeholder="Place your budget in NZD"
                      />
                      <ErrorMessage name="budget" />
                    </div>
                  </div>

                  <div className={styles.labelTextfield}>
                    <label className={styles.label} htmlFor="ingredients">
                      I already have
                    </label>
                    <div className={styles.textfieldWrapper}>
                      <AutoComplete
                        id="ingredients"
                        data-cy="ingredientsInput"
                        suggestions={suggestions}
                        onSuggestionSelect={handleSelectedIngredient}
                      />
                    </div>
                  </div>

                  {ingredientList.length > 0 && (
                    <IngredientList
                      header="Your ingredients"
                      ingredients={ingredientList}
                      onClose={onIngredientClose}
                    />
                  )}

                  <div className={styles.submitWrapper}>
                    <Button disabled={isSubmitting} type="submit">
                      Create weekly plan
                    </Button>
                  </div>

                  {ingredientList.length === 0 && (
                    <div className={styles.tipWrapper}>
                      <p className={styles.tip}>Tip...</p>
                    </div>
                  )}
                </Form>
              );
            }}
          </Formik>
        </div>
      </div>
    </MainPage>
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
