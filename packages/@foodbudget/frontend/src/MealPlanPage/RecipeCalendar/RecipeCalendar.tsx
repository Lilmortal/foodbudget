import { useMemo, useState, useCallback } from 'react';
import {
  Cell,
  CellProps,
  ColumnWithStrictAccessor,
  HeaderGroup,
  Row,
} from 'react-table';
import Calendar, { getSunday } from 'components/Calendar';
import { addDays, getDate, getDay, getMonth, getYear } from 'date-fns';
import DraggableCell from 'components/DraggableCell';
import { Day, Period, mappedDayToText } from './RecipeCalendar.utils';
import RecipeCell, { Recipe } from './RecipeCell';

export type RecipeCalendarPeriod = {
  [period in Period]?: string | null;
};

export interface RecipeCalendarData {
  [date: string]: RecipeCalendarPeriod;
}

type RecipeCalendarWeek = {
  [day in Day]: Recipe;
};

const mappedPeriod: { [index: number]: Period } = {
  0: 'breakfast',
  1: 'lunch',
  2: 'dinner',
};

const renderCell: React.FC<
  CellProps<RecipeCalendarWeek, Recipe> & { onClick(recipe: Recipe): void }
> = ({ value, onClick }) => {
  return <RecipeCell recipe={{ ...value }} onClick={onClick} />;
};

const columns: ColumnWithStrictAccessor<RecipeCalendarWeek>[] = [
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

export interface RecipeCalendarProps extends Styleable {
  recipes?: RecipeCalendarData;
  onMoveRecipe(recipe: RecipeCalendarData): void;
  onRecipeCellClick(recipe: Recipe): void;
  fullDate?: Date;
}

const RecipeCalendar: React.FC<RecipeCalendarProps> = ({
  recipes,
  onMoveRecipe,
  onRecipeCellClick,
  fullDate = new Date(),
  className,
  style,
}) => {
  const [selectedDate, setSelectedDate] = useState(fullDate);

  const sunday = useMemo(() => getSunday(selectedDate), [selectedDate]);

  const handleRenderWeek = useCallback(() => {
    const startOfWeek = `${getDate(sunday)}/${getMonth(sunday) + 1}/${getYear(
      sunday,
    )}`;

    const endOfWeekDate = addDays(sunday, 6);

    const endOfWeek = `${getDate(endOfWeekDate)}/${
      getMonth(endOfWeekDate) + 1
    }/${getYear(endOfWeekDate)}`;

    return (
      <>
        {startOfWeek} - {endOfWeek}
      </>
    );
  }, [sunday]);

  const recipeWeek = useMemo(() => {
    const updatedRecipeWeek: RecipeCalendarWeek[] = [];

    for (let dayNum = 0; dayNum < 7; dayNum += 1) {
      const currentFullDate = addDays(sunday, dayNum);
      const day = mappedDayToText[getDay(currentFullDate)];

      let fullDayRecipes: { [period in Period]: Recipe } = {
        breakfast: {
          fullDate: currentFullDate,
          period: 'breakfast',
          source: '',
        },
        lunch: {
          fullDate: currentFullDate,
          period: 'lunch',
          source: '',
        },
        dinner: {
          fullDate: currentFullDate,
          period: 'dinner',
          source: '',
        },
      };

      if (recipes && recipes[currentFullDate.toDateString()]) {
        const previousRecipes = recipes[currentFullDate.toDateString()];

        fullDayRecipes = {
          breakfast: {
            fullDate: currentFullDate,
            period: 'breakfast',
            source: previousRecipes.breakfast,
          },
          lunch: {
            fullDate: currentFullDate,
            period: 'lunch',
            source: previousRecipes.lunch,
          },
          dinner: {
            fullDate: currentFullDate,
            period: 'dinner',
            source: previousRecipes.dinner,
          },
        };
      }

      Object.values(fullDayRecipes).forEach((currentRecipeWeek, period) => {
        updatedRecipeWeek[period] = {
          ...updatedRecipeWeek[period],
          [day]: currentRecipeWeek,
        };
      });
    }

    return updatedRecipeWeek;
  }, [sunday, recipes]);

  const onMoveCell = <T extends Recipe>(sourceCell: T, destCell: T) => {
    if (!recipes) {
      return;
    }

    const updatedCalendarRecipes = { ...recipes };

    const sourceCellSource =
      updatedCalendarRecipes[sourceCell.fullDate.toDateString()][
        sourceCell.period
      ];

    if (
      recipes[destCell.fullDate.toDateString()] &&
      recipes[destCell.fullDate.toDateString()][destCell.period]
    ) {
      updatedCalendarRecipes[sourceCell.fullDate.toDateString()][
        sourceCell.period
      ] = recipes[destCell.fullDate.toDateString()][destCell.period];
    } else {
      updatedCalendarRecipes[sourceCell.fullDate.toDateString()][
        sourceCell.period
      ] = null;
    }

    updatedCalendarRecipes[destCell.fullDate.toDateString()] = {
      ...updatedCalendarRecipes[destCell.fullDate.toDateString()],
      [destCell.period]: sourceCellSource,
    };

    onMoveRecipe(updatedCalendarRecipes);
  };

  const getDateFromDay = useMemo(
    () => ({
      Sunday: sunday,
      Monday: addDays(sunday, 1),
      Tuesday: addDays(sunday, 2),
      Wednesday: addDays(sunday, 3),
      Thursday: addDays(sunday, 4),
      Friday: addDays(sunday, 5),
      Saturday: addDays(sunday, 6),
    }),
    [sunday],
  );

  const handleRenderColumnHeader = useCallback(
    (column: HeaderGroup<RecipeCalendarWeek>) => {
      let date: Date | undefined;
      if (column.Header?.toString()) {
        date = getDateFromDay[column.Header.toString() as Day];
      }

      return (
        <>
          {date && getDate(date)}-{column.render('Header')}
        </>
      );
    },
    [getDateFromDay],
  );

  const handleRenderRowHeader = (row: Row<RecipeCalendarWeek>) => {
    return <>{mappedPeriod[row.index]}</>;
  };

  const handleRenderCell = (cell: Cell<RecipeCalendarWeek, Recipe>) => {
    const children = <>{cell.render('Cell', { onClick: onRecipeCellClick })}</>;

    // Only allow drag if there is a recipe
    const handleCanDrag = () => !!cell.value.source;

    const handleCanDrop = (item: Recipe) => {
      // if hovering over the selected card
      if (
        cell.value.fullDate === item.fullDate &&
        cell.value.period === item.period
      ) {
        return false;
      }

      return true;
    };

    return (
      <DraggableCell<Recipe>
        source={cell.value.source}
        fullDate={cell.value.fullDate}
        period={cell.value.period}
        onMoveCell={onMoveCell}
        canDrag={handleCanDrag}
        canDrop={handleCanDrop}
      >
        {children}
      </DraggableCell>
    );
  };

  return (
    <Calendar<RecipeCalendarWeek>
      columns={columns}
      data={recipeWeek}
      onSetSelectedDate={setSelectedDate}
      renderWeek={handleRenderWeek}
      renderColumnHeader={handleRenderColumnHeader}
      renderRowHeader={handleRenderRowHeader}
      renderCell={handleRenderCell}
      className={className}
      style={style}
    />
  );
};

export default RecipeCalendar;
