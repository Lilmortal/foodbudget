import { useCalendar } from 'react-calendar-hook';
import { useTable } from 'react-table';
import { useMemo, useState } from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import chunk from 'lodash.chunk';
import { addYears } from 'date-fns';
import classnames from 'classnames';

import styles from './Calendar.module.scss';

import Card, { CardProps } from './Card';

export interface CalendarCardProps {
  date: string;
  card: React.ReactNode;
}
export interface CalendarProps extends Styleable {
  cards?: CalendarCardProps[];
}

const Calendar: React.FC<CalendarProps> = ({ className, style }) => {
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
                <div className={styles.date}>{i.date}</div>
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
    <div className={classnames(styles.wrapper, className)} style={style}>
      <div className={styles.navigation}>
        <div className={styles.previousWrapper}>
          <button
            onClick={() => calendar.selectDate(addYears(calendar.date, -1))}
          >
            Previous year
          </button>
          <button onClick={() => calendar.prevMonth()}>Previous month</button>
        </div>
        <p>
          {calendar.month.name} {calendar.year}
        </p>
        <div className={styles.nextWrapper}>
          <button onClick={() => calendar.nextMonth()}>Next month</button>
          <button onClick={() => calendar.nextMonth()}>Next year</button>
        </div>
      </div>
      <table {...getTableProps()}>
        <thead>
          {headerGroups.map((headerGroup) => (
            <tr {...headerGroup.getHeaderGroupProps()}>
              {headerGroup.headers.map((column) => (
                <th {...column.getHeaderProps()}>{column.render('Header')}</th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody {...getTableBodyProps()}>
          {rows.map((row, rowIndex) => {
            prepareRow(row);

            return (
              <tr {...row.getRowProps()}>
                {row.cells.map((cell) => {
                  return (
                    <td {...cell.getCellProps()}>
                      <Card
                        day={`${cell.column.Header}`}
                        date={`${cell.value}`}
                        row={rowIndex}
                        onMoveCard={onMoveCard}
                      >
                        {cell.render('Cell')}
                      </Card>
                    </td>
                  );
                })}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

const CalendarProvider: React.FC<CalendarProps> = (props) => (
  <DndProvider backend={HTML5Backend}>
    <Calendar {...props} />
  </DndProvider>
);

export default CalendarProvider;
