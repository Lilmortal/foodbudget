import EscapePress from 'components/EscapePress';
import { useState } from 'react';
import styled from 'styled-components';
import Textfield, { TextfieldProps } from '../Textfield';
import Suggestions from './Suggestions';

export interface AutoCompleteProps extends TextfieldProps {
  onSuggestionSelect(suggestion: string): void;
  suggestions: string[];
}

const AutoCompleteWrapper = styled.div({
  display: 'flex',
  flexDirection: 'column',
});

const AutoComplete: React.FC<AutoCompleteProps> = (props) => {
  const [inputValue, setInputValue] = useState<string>('');

  const { onSuggestionSelect, suggestions, ...textfieldProps } = props;

  const [options, setOptions] = useState<string[]>([]);

  const handleEscapePress = () => {
    setOptions([]);
  };

  const handleOnChange = (
    element: React.SyntheticEvent<HTMLInputElement, Event>,
  ) => {
    const { value } = element.currentTarget;

    if (value === '') {
      setOptions([]);
    } else {
      const suggestedValues = suggestions.filter((suggestion) =>
        suggestion.startsWith(value),
      );

      setOptions(suggestedValues);
    }
    setInputValue(value);
  };

  const clearValues = () => {
    setOptions([]);
    setInputValue('');
  };

  const handleOnSuggestionSelect = (suggestion: string) => {
    onSuggestionSelect(suggestion);
    clearValues();
  };

  const handleOnEnterPress = (
    event:
      | React.KeyboardEvent<HTMLLIElement>
      | React.KeyboardEvent<HTMLInputElement>,
  ) => {
    if (event.key === 'Enter') {
      if (options.length === 1) {
        onSuggestionSelect(options[0]);
        clearValues();
      } else if (suggestions.includes(`${event.currentTarget.value}`)) {
        onSuggestionSelect(`${event.currentTarget.value}`);
        clearValues();
      }
      event.preventDefault();
    }
  };

  return (
    <AutoCompleteWrapper>
      <Textfield
        {...textfieldProps}
        onChange={handleOnChange}
        onKeyDown={handleOnEnterPress}
        value={inputValue}
      />
      <Suggestions
        suggestions={options}
        onSuggestionSelect={handleOnSuggestionSelect}
      />
      {handleEscapePress && <EscapePress onEscapePress={handleEscapePress} />}
    </AutoCompleteWrapper>
  );
};

export default AutoComplete;
