import { render, RenderResult, screen, waitFor } from 'test-utils';
import userEvent from '@testing-library/user-event';
import { SearchPage, SearchPageProps } from './SearchPage';

const defaultProps: SearchPageProps = {
  onSubmit: jest.fn(),
  suggestions: ['ingredient1', 'ingredient2', 'ingredient3'],
};

const renderSearchPage = (props?: Partial<SearchPageProps>): RenderResult =>
  render(<SearchPage {...defaultProps} {...props} />);

describe('search page', () => {
  describe('validate queries', () => {
    it('should send a query when a budget is entered', async () => {
      renderSearchPage();
      const input = screen.getByRole('textbox', { name: /My weekly budget/i });

      userEvent.type(input, '3');

      const submitButton = screen.getByRole('button', {
        name: /Create weekly plan/i,
      });

      userEvent.click(submitButton);

      await waitFor(() =>
        expect(defaultProps.onSubmit).toHaveBeenCalledWith({
          budget: '3',
          ingredients: [],
        }),
      );
    });

    it('should send a query when budget and ingredients are entered', async () => {
      renderSearchPage();
      const budgetInput = screen.getByRole('textbox', {
        name: /My weekly budget/i,
      });

      userEvent.type(budgetInput, '3');

      const ingredientsInput = screen.getByRole('textbox', {
        name: /I already have/i,
      });

      userEvent.type(ingredientsInput, 'ingredient2');

      const ingredient2Option = screen
        .getAllByRole('listitem')
        .filter((listItem) => listItem.textContent === 'ingredient2')[0];

      userEvent.click(ingredient2Option);

      userEvent.type(ingredientsInput, 'ingredient3');

      const ingredient3Option = screen
        .getAllByRole('listitem')
        .filter((listItem) => listItem.textContent === 'ingredient3')[0];

      userEvent.click(ingredient3Option);

      const submitButton = screen.getByRole('button', {
        name: /Create weekly plan/i,
      });

      userEvent.click(submitButton);

      await waitFor(() =>
        expect(defaultProps.onSubmit).toHaveBeenCalledWith({
          budget: '3',
          ingredients: ['ingredient2', 'ingredient3'],
        }),
      );
    });
  });

  describe('valid error messages', () => {
    it('should display a error if no budget is specified after submit', async () => {
      renderSearchPage();

      const submitButton = screen.getByRole('button', {
        name: /Create weekly plan/i,
      });

      userEvent.click(submitButton);

      await waitFor(() => {
        expect(screen.getByText(/Please enter your budget/i)).not.toBeNull();
        expect(
          screen.queryByText(/Please enter a valid positive number/i),
        ).toBeNull();
        expect(screen.queryByText(/Please enter a valid number/i)).toBeNull();
      });
    });

    it('should display an error if budget is not a positive number', async () => {
      renderSearchPage();

      const budgetInput = screen.getByRole('textbox', {
        name: /My weekly budget/i,
      });

      userEvent.type(budgetInput, '-3');

      const submitButton = screen.getByRole('button', {
        name: /Create weekly plan/i,
      });

      userEvent.click(submitButton);

      await waitFor(() => {
        expect(screen.queryByText(/Please enter your budget/i)).toBeNull();
        expect(
          screen.getByText(/Please enter a valid positive number/i),
        ).not.toBeNull();
        expect(screen.queryByText(/Please enter a valid number/i)).toBeNull();
      });
    });

    it('should display an error if budget is not a valid number', async () => {
      renderSearchPage();

      const budgetInput = screen.getByRole('textbox', {
        name: /My weekly budget/i,
      });

      userEvent.type(budgetInput, 'not valid');

      const submitButton = screen.getByRole('button', {
        name: /Create weekly plan/i,
      });

      userEvent.click(submitButton);

      await waitFor(() => {
        expect(screen.queryByText(/Please enter your budget/i)).toBeNull();
        expect(
          screen.queryByText(/Please enter a valid positive number/i),
        ).toBeNull();
        expect(screen.getByText(/Please enter a valid number/i)).not.toBeNull();
      });
    });

    it('should not display any error if budget is a valid number', async () => {
      renderSearchPage();

      const budgetInput = screen.getByRole('textbox', {
        name: /My weekly budget/i,
      });

      userEvent.type(budgetInput, '4');

      const submitButton = screen.getByRole('button', {
        name: /Create weekly plan/i,
      });

      userEvent.click(submitButton);

      await waitFor(() => {
        expect(screen.queryByText(/Please enter your budget/i)).toBeNull();
        expect(
          screen.queryByText(/Please enter a valid positive number/i),
        ).toBeNull();
        expect(screen.queryByText(/Please enter a valid number/i)).toBeNull();
      });
    });
  });

  it('should not trigger handleSelectedIngredient if the suggestion text entered is already selected', () => {
    renderSearchPage();

    const ingredientsInput = screen.getByRole('textbox', {
      name: /I already have/i,
    });

    userEvent.type(ingredientsInput, 'ingredient1{enter}');

    userEvent.clear(ingredientsInput);

    userEvent.type(ingredientsInput, 'ingredient1{enter}');

    const ingredientButton = screen.getAllByRole('button', {
      name: /ingredient1/i,
    });

    expect(ingredientButton).toHaveLength(1);
  });

  it('should remove an ingredient when selected', async () => {
    renderSearchPage();

    const ingredientsInput = screen.getByRole('textbox', {
      name: /I already have/i,
    });

    userEvent.type(ingredientsInput, 'ingredient2');

    const ingredientOption = screen
      .getAllByRole('listitem')
      .filter((listItem) => listItem.textContent === 'ingredient2')[0];

    userEvent.click(ingredientOption);

    const ingredientButton = screen.getByRole('button', {
      name: /ingredient2/i,
    });

    expect(ingredientButton).not.toBeNull();

    userEvent.click(ingredientButton);

    const updatedIngredientButton = screen.queryByRole('button', {
      name: /ingredient2/i,
    });

    expect(updatedIngredientButton).toBeNull();
  });
});
