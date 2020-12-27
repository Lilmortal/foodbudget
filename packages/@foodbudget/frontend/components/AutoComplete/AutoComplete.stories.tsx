import React from 'react';
import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import AutoComplete from './AutoComplete';

const suggestions = ['ingredient1', 'ingredient2', 'ingredient3'];
storiesOf('auto complete', module).add('default', () => (
  <>
    <p style={{ marginBottom: '1rem' }}>
      List of suggestions: {suggestions.join(', ')}
    </p>
    <AutoComplete
      onSuggestionSelect={action('onSuggestionSelect')}
      suggestions={suggestions}
    />
  </>
));
