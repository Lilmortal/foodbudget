import classnames from 'classnames';
import styles from './Suggestions.module.scss';

export interface SuggestionsProps extends Styleable {
  suggestions: string[];
  onSuggestionSelect(suggestion: string): void;
}

const Suggestions: React.FC<SuggestionsProps> = ({
  suggestions,
  onSuggestionSelect,
  className,
  style,
}) => {
  const handleOnClick = (
    element: React.SyntheticEvent<HTMLLIElement, Event>,
  ) => {
    onSuggestionSelect(
      element.currentTarget.textContent || element.currentTarget.innerText,
    );
  };

  const handleUpArrowKeyPress = (
    event:
      | React.KeyboardEvent<HTMLLIElement>
      | React.KeyboardEvent<HTMLInputElement>,
  ) => {
    if (event.currentTarget.previousElementSibling) {
      (event.currentTarget.previousElementSibling as HTMLLIElement)?.focus();
    } else {
      (event.currentTarget.parentNode?.lastChild as HTMLLIElement)?.focus();
    }
  };

  const handleDownArrowKeyPress = (
    event:
      | React.KeyboardEvent<HTMLLIElement>
      | React.KeyboardEvent<HTMLInputElement>,
  ) => {
    if (event.currentTarget.nextSibling) {
      (event.currentTarget.nextSibling as HTMLLIElement).focus();
    } else {
      (event.currentTarget.parentNode?.firstChild as HTMLLIElement)?.focus();
    }
  };

  const handleEnterKeyPress = (
    event:
      | React.KeyboardEvent<HTMLLIElement>
      | React.KeyboardEvent<HTMLInputElement>,
  ) => {
    onSuggestionSelect(event.currentTarget.innerText);
  };

  const handleKeyPress = (
    event:
      | React.KeyboardEvent<HTMLLIElement>
      | React.KeyboardEvent<HTMLInputElement>,
  ) => {
    if (event.key === 'ArrowUp') {
      handleUpArrowKeyPress(event);
    }

    if (event.key === 'ArrowDown') {
      handleDownArrowKeyPress(event);
    }

    if (event.key === 'Enter') {
      handleEnterKeyPress(event);
    }

    event.preventDefault();
  };

  return (
    <ul
      className={classnames(
        styles.list,
        {
          [styles['list--hasSuggestions']]: suggestions.length > 0,
        },
        className,
      )}
      style={style}
    >
      {suggestions.map((suggestion, index) => (
        <li
          className={classnames(styles.options)}
          tabIndex={0}
          key={`suggestion-${index}`}
          onClick={handleOnClick}
          onKeyUp={handleKeyPress}
        >
          {suggestion}
        </li>
      ))}
    </ul>
  );
};

export default Suggestions;
