import React from 'react';
import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import AutoComplete from './AutoComplete';

storiesOf('auto complete', module).add('default', () => (
  <AutoComplete
    onSuggestionSelect={action('onSuggestionSelect')}
    suggestions={['ingredient1', 'ingredient2', 'ingredient3']}
  />
));
