import { Column, useTable } from 'react-table';
import { useMemo, useState } from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import {
  addDays,
  addMonths,
  addWeeks,
  addYears,
  getDay,
  getMonth,
  getYear,
  subMonths,
  subWeeks,
  subYears,
} from 'date-fns';
import classnames from 'classnames';

import styles from './Calendar.module.scss';

import Card, { CardProps } from './Card';
import { mappedDayToText, getSunday, Day } from './Calendar.utils';

export type Period = 'breakfast' | 'lunch' | 'dinner';

export type CalendarRecipesPeriods = {
  [period in Period]?: React.ReactNode;
};

export interface CalendarRecipes {
  [date: string]: CalendarRecipesPeriods;
}

export interface CalendarProps extends Styleable {
  // TODO: ISO string?
  fullDate?: Date;
  recipes: CalendarRecipes;
}

interface RecipeWeek {
  fullDate: Date;
  period: Period;
  recipe: React.ReactNode;
}

const renderCell: React.FC<Pick<RecipeWeek, 'recipe'>> = ({ recipe }) => {
  return <>{recipe}</>;
};

const columns: Column<{ [key in Day]: React.ReactNode }>[] = [
  {
    Header: 'Sunday',
    accessor: 'Sunday',
    Cell: renderCell,
  },
  {
    Header: 'Monday',
    accessor: 'Monday',
    Cell: renderCell,
  },
  {
    Header: 'Tuesday',
    accessor: 'Tuesday',
    Cell: renderCell,
  },
  {
    Header: 'Wednesday',
    accessor: 'Wednesday',
    Cell: renderCell,
  },
  {
    Header: 'Thursday',
    accessor: 'Thursday',
    Cell: renderCell,
  },
  {
    Header: 'Friday',
    accessor: 'Friday',
    Cell: renderCell,
  },
  {
    Header: 'Saturday',
    accessor: 'Saturday',
    Cell: renderCell,
  },
];

const Calendar: React.FC<CalendarProps> = ({
  recipes,
  fullDate = new Date(),
  className,
  style,
}) => {
  const [calendarRecipes, setCalendarRecipes] = useState(recipes);
  const [selectedDate, setSelectedDate] = useState(fullDate);

  const recipeWeek = useMemo(() => {
    const sunday = getSunday(selectedDate);

    const updatedRecipeWeek: { [d in Day]: React.ReactNode }[] = [];

    for (let dayNum = 0; dayNum < 7; dayNum += 1) {
      const currentFullDate = addDays(sunday, dayNum);
      const day = mappedDayToText[getDay(currentFullDate)];

      let fullDayRecipes: { [period in Period]: RecipeWeek } = {
        breakfast: {
          fullDate: currentFullDate,
          period: 'breakfast',
          recipe: null,
        },
        lunch: { fullDate: currentFullDate, period: 'lunch', recipe: null },
        dinner: {
          fullDate: currentFullDate,
          period: 'dinner',
          recipe: null,
        },
      };

      if (calendarRecipes && calendarRecipes[currentFullDate.toString()]) {
        const previousRecipes = calendarRecipes[currentFullDate.toString()];

        fullDayRecipes = {
          breakfast: {
            fullDate: currentFullDate,
            period: 'breakfast',
            recipe: previousRecipes.breakfast,
          },
          lunch: {
            fullDate: currentFullDate,
            period: 'lunch',
            recipe: previousRecipes.lunch,
          },
          dinner: {
            fullDate: currentFullDate,
            period: 'dinner',
            recipe: previousRecipes.dinner,
          },
        };
      }

      Object.entries(fullDayRecipes).forEach(
        ([, currentRecipeWeek], period) => {
          updatedRecipeWeek[period] = {
            ...updatedRecipeWeek[period],
            [day]: currentRecipeWeek,
          };
        },
      );
    }

    return updatedRecipeWeek;
  }, [selectedDate, calendarRecipes]);

  const onMoveCard = (sourceCard: CardProps, destCard: CardProps) => {
    const updatedCalendarRecipes = { ...calendarRecipes };

    if (
      calendarRecipes[destCard.fullDate.toString()] &&
      calendarRecipes[destCard.fullDate.toString()][destCard.period]
    ) {
      updatedCalendarRecipes[sourceCard.fullDate.toString()] = {
        ...calendarRecipes[sourceCard.fullDate.toString()],
        [sourceCard.period]:
          calendarRecipes[destCard.fullDate.toString()][destCard.period],
      };
    } else {
      delete updatedCalendarRecipes[sourceCard.fullDate.toString()];
    }

    updatedCalendarRecipes[destCard.fullDate.toString()] = {
      ...calendarRecipes[destCard.fullDate.toString()],
      [destCard.period]:
        calendarRecipes[sourceCard.fullDate.toString()][sourceCard.period],
    };

    setCalendarRecipes(updatedCalendarRecipes);
  };

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow,
  } = useTable({ columns, data: recipeWeek });

  return (
    <div className={classnames(styles.wrapper, className)} style={style}>
      <div className={styles.navigation}>
        <div className={styles.previousWrapper}>
          <button onClick={() => setSelectedDate(subYears(selectedDate, 1))}>
            Previous year
          </button>
          <button onClick={() => setSelectedDate(subMonths(selectedDate, 1))}>
            Previous month
          </button>
          <button onClick={() => setSelectedDate(subWeeks(selectedDate, 1))}>
            Previous week
          </button>
        </div>
        <p>
          {getDay(selectedDate)} {getMonth(selectedDate)}{' '}
          {getYear(selectedDate)}
        </p>
        <div className={styles.nextWrapper}>
          <button onClick={() => setSelectedDate(addWeeks(selectedDate, 1))}>
            Next week
          </button>
          <button onClick={() => setSelectedDate(addMonths(selectedDate, 1))}>
            Next month
          </button>
          <button onClick={() => setSelectedDate(addYears(selectedDate, 1))}>
            Next year
          </button>
        </div>
      </div>
      <table {...getTableProps()} className={styles.table}>
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
          {rows.map((row) => {
            prepareRow(row);

            return (
              <tr {...row.getRowProps()}>
                {row.cells.map((cell) => {
                  return (
                    <td {...cell.getCellProps()} className={styles.td}>
                      <Card
                        fullDate={cell.value.fullDate}
                        period={cell.value.period}
                        onMoveCard={onMoveCard}
                      >
                        {cell.render('Cell', {
                          recipe: cell.value.recipe,
                        })}
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
