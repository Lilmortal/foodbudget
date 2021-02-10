import { render, RenderResult, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import RecipeCalendar, { RecipeCalendarProps } from './RecipeCalendar';

const defaultProps: RecipeCalendarProps = {
  recipes: {},
  onMoveRecipe: jest.fn(),
  onRecipeCellClick: jest.fn(),
  fullDate: new Date('12/4/2020'),
};

const renderRecipeCalendar = (
  props?: Partial<RecipeCalendarProps>,
): RenderResult =>
  render(
    <DndProvider backend={HTML5Backend}>
      <RecipeCalendar {...defaultProps} {...props} />
    </DndProvider>,
  );

describe('recipe calendar', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should render the fullDate props week', () => {
    renderRecipeCalendar();

    expect(screen.getByTestId('selectedWeek').innerHTML).toEqual(
      '29/11/2020 - 5/12/2020',
    );
  });

  it('should render the previous year when selected', () => {
    renderRecipeCalendar();

    const previousYearButton = screen.getByRole('button', {
      name: /Previous year/,
    });

    userEvent.click(previousYearButton);

    expect(screen.getByTestId('selectedWeek').innerHTML).toEqual(
      '1/12/2019 - 7/12/2019',
    );
  });

  it('should render the previous month when selected', () => {
    renderRecipeCalendar();

    const previousMonthButton = screen.getByRole('button', {
      name: /Previous month/,
    });

    userEvent.click(previousMonthButton);

    expect(screen.getByTestId('selectedWeek').innerHTML).toEqual(
      '1/11/2020 - 7/11/2020',
    );
  });

  it('should render the previous week when selected', () => {
    renderRecipeCalendar();

    const previousWeekButton = screen.getByRole('button', {
      name: /Previous week/,
    });

    userEvent.click(previousWeekButton);

    expect(screen.getByTestId('selectedWeek').innerHTML).toEqual(
      '22/11/2020 - 28/11/2020',
    );
  });

  it('should render the next year when selected', () => {
    renderRecipeCalendar();

    const nextYearButton = screen.getByRole('button', {
      name: /Next year/,
    });

    userEvent.click(nextYearButton);

    expect(screen.getByTestId('selectedWeek').innerHTML).toEqual(
      '28/11/2021 - 4/12/2021',
    );
  });

  it('should render the next month when selected', () => {
    renderRecipeCalendar();

    const nextMonthButton = screen.getByRole('button', {
      name: /Next month/,
    });

    userEvent.click(nextMonthButton);

    expect(screen.getByTestId('selectedWeek').innerHTML).toEqual(
      '3/1/2021 - 9/1/2021',
    );
  });

  it('should render the next week when selected', () => {
    renderRecipeCalendar();

    const nextWeekButton = screen.getByRole('button', {
      name: /Next week/,
    });

    userEvent.click(nextWeekButton);

    expect(screen.getByTestId('selectedWeek').innerHTML).toEqual(
      '6/12/2020 - 12/12/2020',
    );
  });
});

// TODO: Add these Cypress tests
// it('should drag cell1 to cell2')
// it('should verify cell is not draggable if no children')
// it('should set hover to true if cell is hovered')
// it('should set hover to false if hovering own cell')
