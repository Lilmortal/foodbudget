import { useCalendar } from 'react-calendar-hook';
import { useTable } from 'react-table';
import { useMemo, useState } from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import chunk from 'lodash.chunk';
import { addYears } from 'date-fns';
import { v4 } from 'uuid';
import styled from 'styled-components';
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
import Card, { CardProps } from './Card';

export interface CalendarCardProps {
  date: string;
  card: React.ReactNode;
}
export interface CalendarProps {
  cards?: CalendarCardProps[];
}

const CalendarDate = styled.div({
  position: 'absolute',
});

const Calendar: React.FC<CalendarProps> = () => {
  const currentDate = new Date();
  const calendar = useCalendar(currentDate);

  const data = useMemo(
    () =>
      chunk(calendar.items, 7).map((item) => ({
        ...item.reduce(
          (acc, i) => ({
            ...acc,
            [i.name]: (
              <>
                <CalendarDate>{i.date}</CalendarDate>
                <div style={{ backgroundColor: 'yellow' }}></div>
              </>
            ),
          }),
          {},
        ),
      })),
    [calendar.items],
  );

  const [cards, setCards] = useState(data);

  const onMoveCard = (sourceCard: CardProps, destCard: CardProps) => {
    const tempCards = [...cards];

    tempCards[sourceCard.row] = {
      ...tempCards[sourceCard.row],
      [sourceCard.day]: Number(destCard.date),
    };
    tempCards[destCard.row] = {
      ...tempCards[destCard.row],
      [destCard.day]: Number(sourceCard.date),
    };

    setCards(tempCards);
  };

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
  } = useTable({ columns, data: cards });

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
          {rows.map((row, rowIndex) => {
            prepareRow(row);

            return (
              <CalendarTr {...row.getRowProps()}>
                {row.cells.map((cell) => {
                  return (
                    <CalendarTd {...cell.getCellProps()}>
                      <Card
                        day={`${cell.column.Header}`}
                        date={`${cell.value}`}
                        row={rowIndex}
                        onMoveCard={onMoveCard}
                      >
                        {cell.render('Cell')}
                      </Card>
                    </CalendarTd>
                  );
                })}
              </CalendarTr>
            );
          })}
        </CalendarBody>
      </CalendarTable>
    </CalendarWrapper>
  );
};

const CalendarProvider = () => (
  <DndProvider backend={HTML5Backend}>
    <Calendar />
  </DndProvider>
);

export default CalendarProvider;
