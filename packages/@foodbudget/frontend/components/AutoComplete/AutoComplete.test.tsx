import { render, RenderResult, screen, userEvent } from 'test-utils';
import AutoComplete, { AutoCompleteProps } from './AutoComplete';

const defaultProps: AutoCompleteProps = {
  onSuggestionSelect: jest.fn(),
  id: 'test',
  suggestions: ['fish', 'pork', 'mushroom', 'fish2'],
};

const renderAutocomplete = (props?: Partial<AutoCompleteProps>): RenderResult =>
  render(<AutoComplete {...defaultProps} {...props} />);

describe('auto complete', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('display suggestions', () => {
    it('return a result when partially entering input', () => {
      renderAutocomplete();

      const input = screen.getByRole('textbox');

      userEvent.type(input, 'po');

      const suggestions = screen
        .getAllByRole('listitem')
        .map((item) => item.textContent);

      expect(suggestions).toHaveLength(1);
      expect(suggestions).toEqual(['pork']);
    });

    it('return multiple results when partially entering input', () => {
      renderAutocomplete();

      const input = screen.getByRole('textbox');

      userEvent.type(input, 'fi');

      const suggestions = screen
        .getAllByRole('listitem')
        .map((item) => item.textContent);

      expect(suggestions).toHaveLength(2);
      expect(suggestions).toEqual(['fish', 'fish2']);
    });

    it('should trigger onSuggestionSelect on enter key press when there is only one suggestion displayed', async () => {
      renderAutocomplete();

      const input = screen.getByRole('textbox');

      userEvent.type(input, 'po{enter}');

      expect(defaultProps.onSuggestionSelect).toBeCalledWith('pork');
    });

    it(
      'should not trigger onSuggestionSelect on enter key press when there are multiple' +
        'suggestions displayed',
      async () => {
        renderAutocomplete();

        const input = screen.getByRole('textbox');

        userEvent.type(input, 'fi{enter}');

        expect(defaultProps.onSuggestionSelect).not.toBeCalled();
      },
    );

    it('should trigger onSuggestionSelect if the whole suggestion text is entered', () => {
      renderAutocomplete();

      const input = screen.getByRole('textbox');

      userEvent.type(input, 'fish{enter}');

      expect(defaultProps.onSuggestionSelect).toBeCalledWith('fish');
    });
  });
});
