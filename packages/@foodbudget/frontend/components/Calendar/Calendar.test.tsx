import { render, RenderResult, screen, userEvent } from 'test-utils';
import Calendar, { CalendarProps } from './Calendar';

const defaultProps: CalendarProps = {
  recipes: {
    [new Date('10/4/2020').toString()]: {
      breakfast: <div>Cell1 breakfast</div>,
      lunch: <div>Cell1 lunch</div>,
      dinner: <div>Cell1 dinner</div>,
    },
    [new Date('12/4/2020').toString()]: {
      breakfast: <div>Cell2 breakfast</div>,
      lunch: <div>Cell2 lunch</div>,
      dinner: <div>Cell2 dinner</div>,
    },
  },
  fullDate: new Date('12/4/2020'),
};

const renderCalendar = (props?: Partial<CalendarProps>): RenderResult =>
  render(<Calendar {...defaultProps} {...props} />);

describe('carousel', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should render the fullDate props week', () => {
    renderCalendar();

    expect(screen.getByTestId('currentDate').innerHTML).toEqual(
      '29/11/2020 - 5/12/2020',
    );
  });

  it('should render the previous year when selected', () => {
    renderCalendar();

    const previousYearButton = screen.getByRole('button', {
      name: /Previous year/,
    });

    userEvent.click(previousYearButton);

    expect(screen.getByTestId('currentDate').innerHTML).toEqual(
      '1/12/2019 - 7/12/2019',
    );
  });

  it('should render the previous month when selected', () => {
    renderCalendar();

    const previousMonthButton = screen.getByRole('button', {
      name: /Previous month/,
    });

    userEvent.click(previousMonthButton);

    expect(screen.getByTestId('currentDate').innerHTML).toEqual(
      '1/11/2020 - 7/11/2020',
    );
  });

  it('should render the previous week when selected', () => {
    renderCalendar();

    const previousWeekButton = screen.getByRole('button', {
      name: /Previous week/,
    });

    userEvent.click(previousWeekButton);

    expect(screen.getByTestId('currentDate').innerHTML).toEqual(
      '22/11/2020 - 28/11/2020',
    );
  });

  it('should render the next year when selected', () => {
    renderCalendar();

    const nextYearButton = screen.getByRole('button', {
      name: /Next year/,
    });

    userEvent.click(nextYearButton);

    expect(screen.getByTestId('currentDate').innerHTML).toEqual(
      '28/11/2021 - 4/12/2021',
    );
  });

  it('should render the next month when selected', () => {
    renderCalendar();

    const nextMonthButton = screen.getByRole('button', {
      name: /Next month/,
    });

    userEvent.click(nextMonthButton);

    expect(screen.getByTestId('currentDate').innerHTML).toEqual(
      '3/1/2021 - 9/1/2021',
    );
  });

  it('should render the next week when selected', () => {
    renderCalendar();

    const nextWeekButton = screen.getByRole('button', {
      name: /Next week/,
    });

    userEvent.click(nextWeekButton);

    expect(screen.getByTestId('currentDate').innerHTML).toEqual(
      '6/12/2020 - 12/12/2020',
    );
  });
});

// TODO: Add these Cypress tests
// it('should drag cell1 to cell2')
// it('should verify cell is not draggable if no children')
// it('should set hover to true if cell is hovered')
// it('should set hover to false if hovering own cell')
