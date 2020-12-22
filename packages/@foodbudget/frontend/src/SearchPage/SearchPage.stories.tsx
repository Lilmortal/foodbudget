import React from 'react';
import { storiesOf } from '@storybook/react';
import SearchPageContainer from './SearchPage';

const suggestions = ['ingredient1', 'ingredient2', 'ingredient3', 'fish'];

storiesOf('search page', module).add('default', () => (
  <SearchPageContainer suggestions={suggestions} />
));
