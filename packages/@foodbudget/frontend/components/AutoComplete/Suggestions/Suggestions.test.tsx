import { fireEvent, render, RenderResult, screen } from 'test-utils';
import userEvent from '@testing-library/user-event';
import Suggestions, { SuggestionsProps } from './Suggestions';

const defaultProps: SuggestionsProps = {
  onSuggestionSelect: jest.fn(),
  suggestions: ['fish', 'pork', 'mushroom', 'fish2'],
};

const renderSuggestions = (props?: Partial<SuggestionsProps>): RenderResult =>
  render(<Suggestions {...defaultProps} {...props} />);

describe('suggestions', () => {
  it('should trigger onSuggestionSelect when a suggestion is clicked', () => {
    renderSuggestions();

    const fishButton = screen
      .getAllByRole('listitem')
      .filter((item) => item.textContent === 'fish')[0];

    userEvent.click(fishButton);

    expect(defaultProps.onSuggestionSelect).toBeCalledTimes(1);
  });

  it('should trigger onSuggestionSelect when a suggestion button is tabbed into and entered', () => {
    renderSuggestions();

    const fishButton = screen
      .getAllByRole('listitem')
      .filter((item) => item.textContent === 'fish')[0];

    fireEvent.keyDown(fishButton, { key: 'Enter', keyCode: 13 });

    expect(defaultProps.onSuggestionSelect).toBeCalledTimes(1);
  });
});
