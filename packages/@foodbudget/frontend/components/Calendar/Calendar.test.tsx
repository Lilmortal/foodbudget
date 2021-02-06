import { render, RenderResult, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Calendar, { CalendarProps } from './Calendar';

const defaultProps: CalendarProps<{}> = {
  columns: [],
  data: [],
  onSetSelectedDate: jest.fn(),
  renderWeek: jest.fn(),
  renderCell: jest.fn(),
  renderColumnHeader: jest.fn(),
  renderRowHeader: jest.fn(),
};

const renderCalendar = (props?: Partial<CalendarProps<{}>>): RenderResult =>
  render(<Calendar {...defaultProps} {...props} />);

describe('calendar', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should call onSetSelectedDate when the previous year is selected', () => {
    renderCalendar();

    const previousYearButton = screen.getByRole('button', {
      name: /Previous year/,
    });

    userEvent.click(previousYearButton);

    expect(defaultProps.onSetSelectedDate).toBeCalled();
  });

  it('should call onSetSelectedDate when the previous month is selected', () => {
    renderCalendar();

    const previousMonthButton = screen.getByRole('button', {
      name: /Previous month/,
    });

    userEvent.click(previousMonthButton);

    expect(defaultProps.onSetSelectedDate).toBeCalled();
  });

  it('should call onSetSelectedDate when the previous week is selected', () => {
    renderCalendar();

    const previousWeekButton = screen.getByRole('button', {
      name: /Previous week/,
    });

    userEvent.click(previousWeekButton);

    expect(defaultProps.onSetSelectedDate).toBeCalled();
  });

  it('should call onSetSelectedDate when the next year is selected', () => {
    renderCalendar();

    const nextYearButton = screen.getByRole('button', {
      name: /Next year/,
    });

    userEvent.click(nextYearButton);

    expect(defaultProps.onSetSelectedDate).toBeCalled();
  });

  it('should call onSetSelectedDate when the next month is selected', () => {
    renderCalendar();

    const nextMonthButton = screen.getByRole('button', {
      name: /Next month/,
    });

    userEvent.click(nextMonthButton);

    expect(defaultProps.onSetSelectedDate).toBeCalled();
  });

  it('should call onSetSelectedDate when the next week is selected', () => {
    renderCalendar();

    const nextWeekButton = screen.getByRole('button', {
      name: /Next week/,
    });

    userEvent.click(nextWeekButton);

    expect(defaultProps.onSetSelectedDate).toBeCalled();
  });
});
