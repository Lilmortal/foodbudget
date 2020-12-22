import React from 'react';
import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import IngredientList from './IngredientList';

storiesOf('ingredient list', module).add('default', () => (
  <IngredientList
    ingredients={['ingredient1', 'ingredient2']}
    onClose={action('onClose')}
  />
));
