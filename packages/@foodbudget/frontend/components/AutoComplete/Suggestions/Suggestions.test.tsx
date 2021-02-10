import { render, RenderResult, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Suggestions, { SuggestionsProps } from './Suggestions';

const defaultProps: SuggestionsProps = {
  onSuggestionSelect: jest.fn(),
  suggestions: ['fish', 'pork', 'mushroom', 'fish2'],
};

const renderSuggestions = (props?: Partial<SuggestionsProps>): RenderResult =>
  render(<Suggestions {...defaultProps} {...props} />);

describe('suggestions', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should trigger onSuggestionSelect when a suggestion is clicked', () => {
    renderSuggestions();

    const suggestions = screen.getAllByRole('listitem');

    userEvent.click(suggestions[2]);

    expect(defaultProps.onSuggestionSelect).toBeCalledWith('mushroom');
  });

  it('should trigger onSuggestionSelect when a suggestion button is tabbed into and entered', () => {
    renderSuggestions();

    const suggestions = screen.getAllByRole('listitem');

    userEvent.tab();
    userEvent.tab();

    expect(suggestions[1]).toHaveFocus();

    userEvent.type(suggestions[1], '{enter}');

    expect(defaultProps.onSuggestionSelect).toBeCalledWith('pork');
  });

  it('should focus the second suggestion when down arrow key is pressed', () => {
    renderSuggestions();

    const suggestions = screen.getAllByRole('listitem');

    userEvent.type(suggestions[0], '{arrowdown}');

    expect(suggestions[1]).toHaveFocus();
  });

  it('should focus the second suggestion when up arrow key is pressed', () => {
    renderSuggestions();

    const suggestions = screen.getAllByRole('listitem');

    userEvent.type(suggestions[0], '{arrowup}');

    expect(suggestions[suggestions.length - 1]).toHaveFocus();
  });
});
