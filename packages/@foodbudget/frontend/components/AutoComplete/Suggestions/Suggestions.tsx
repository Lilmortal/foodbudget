import styled from 'styled-components';
import { v4 } from 'uuid';

const SuggestionOption = styled.li({
  listStyleType: 'none',
  paddingLeft: '15px',
  height: '44px',
  cursor: 'pointer',
  display: 'flex',
  alignItems: 'center',

  ':hover': {
    backgroundColor: 'rgba(2, 0, 185, 0.05)',
  },
});

export interface SuggestionsProps {
  suggestions: string[];
  onSuggestionSelect(suggestion: string): void;
}

interface SuggestionListProps {
  suggestions: string[];
}

const SuggestionList = styled.ul<SuggestionListProps>((props) => ({
  display: 'flex',
  flexDirection: 'column',
  border:
    props.suggestions.length > 0
      ? ` 1px solid ${props.theme.colors.primaryBorder}`
      : 'none',
  borderRadius: '5px',
  backgroundColor: props.theme.colors.white,
  boxShadow: '4px -4px 5px rgba(2, 0, 185, 0.1)',
  maxWidth: '400px',
}));

const Suggestions: React.FC<SuggestionsProps> = ({
  suggestions,
  onSuggestionSelect,
}) => {
  const handleOnClick = (
    element: React.SyntheticEvent<HTMLLIElement, Event>,
  ) => {
    onSuggestionSelect(
      element.currentTarget.textContent || element.currentTarget.innerText,
    );
  };

  const handleKeyPress = (
    event:
      | React.KeyboardEvent<HTMLLIElement>
      | React.KeyboardEvent<HTMLInputElement>,
  ) => {
    if (event.key === 'ArrowUp') {
      if (event.currentTarget.previousElementSibling) {
        (event.currentTarget.previousElementSibling as HTMLLIElement)?.focus();
      } else {
        (event.currentTarget.parentNode?.lastChild as HTMLLIElement)?.focus();
      }
    }

    if (event.key === 'ArrowDown') {
      if (event.currentTarget.nextSibling) {
        (event.currentTarget.nextSibling as HTMLLIElement).focus();
      } else {
        (event.currentTarget.parentNode?.firstChild as HTMLLIElement)?.focus();
      }
    }

    if (event.key === 'Enter') {
      onSuggestionSelect(event.currentTarget.innerText);
    }

    event.preventDefault();
  };

  return (
    <SuggestionList suggestions={suggestions}>
      {suggestions.map((suggestion) => (
        <SuggestionOption
          tabIndex={0}
          key={`suggestion-${v4()}`}
          onClick={handleOnClick}
          onKeyUp={handleKeyPress}
        >
          {suggestion}
        </SuggestionOption>
      ))}
    </SuggestionList>
  );
};

export default Suggestions;
