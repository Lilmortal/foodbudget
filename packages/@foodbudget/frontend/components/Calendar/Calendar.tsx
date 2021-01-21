import { useCalendar } from 'react-calendar-hook';
import { useTable } from 'react-table';
import { useMemo } from 'react';
import chunk from 'lodash.chunk';
import { addYears } from 'date-fns';
import {
  CalendarBody,
  CalendarHead,
  CalendarTable,
  CalendarTd,
  CalendarTh,
  CalendarTr,
  CalendarWrapper,
  NavigationWrapper,
  NextNavigationWrapper,
  PreviousNavigationWrapper,
} from './Calendar.Styled';

export interface CalendarProps {
  test?: string;
}

const Calendar: React.FC<CalendarProps> = () => {
  const currentDate = new Date();
  const calendar = useCalendar(currentDate);

  const data = useMemo(
    () =>
      chunk(calendar.items, 7).map((item) => ({
        ...item.reduce(
          (acc, i) => ({
            ...acc,
            [i.name]: i.date,
          }),
          {},
        ),
      })),
    [calendar.items],
  );

  const columns = useMemo(
    () => [
      {
        Header: 'Sunday',
        accessor: 'Sunday',
      },
      {
        Header: 'Monday',
        accessor: 'Monday',
      },
      {
        Header: 'Tuesday',
        accessor: 'Tuesday',
      },
      {
        Header: 'Wednesday',
        accessor: 'Wednesday',
      },
      {
        Header: 'Thursday',
        accessor: 'Thursday',
      },
      {
        Header: 'Friday',
        accessor: 'Friday',
      },
      {
        Header: 'Saturday',
        accessor: 'Saturday',
      },
    ],
    [],
  );

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow,
  } = useTable({ columns, data });

  return (
    <CalendarWrapper>
      <NavigationWrapper>
        <PreviousNavigationWrapper>
          <button
            onClick={() => calendar.selectDate(addYears(calendar.date, -1))}
          >
            Previous year
          </button>
          <button onClick={() => calendar.prevMonth()}>Previous month</button>
        </PreviousNavigationWrapper>
        <p>
          {calendar.month.name} {calendar.year}
        </p>
        <NextNavigationWrapper>
          <button onClick={() => calendar.nextMonth()}>Next month</button>
          <button onClick={() => calendar.nextMonth()}>Next year</button>
        </NextNavigationWrapper>
      </NavigationWrapper>
      <CalendarTable {...getTableProps()}>
        <CalendarHead>
          {headerGroups.map((headerGroup) => (
            <CalendarTr {...headerGroup.getHeaderGroupProps()}>
              {headerGroup.headers.map((column) => (
                <CalendarTh {...column.getHeaderProps()}>
                  {column.render('Header')}
                </CalendarTh>
              ))}
            </CalendarTr>
          ))}
        </CalendarHead>
        <CalendarBody {...getTableBodyProps()}>
          {rows.map((row) => {
            prepareRow(row);

            return (
              <CalendarTr {...row.getRowProps()}>
                {row.cells.map((cell) => (
                  <CalendarTd {...cell.getCellProps()}>
                    {cell.render('Cell')}
                  </CalendarTd>
                ))}
              </CalendarTr>
            );
          })}
        </CalendarBody>
      </CalendarTable>
    </CalendarWrapper>
  );
};

export default Calendar;
