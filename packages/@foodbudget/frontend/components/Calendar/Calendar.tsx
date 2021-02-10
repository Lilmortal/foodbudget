import {
  useTable,
  Row,
  Cell,
  ColumnWithStrictAccessor,
  HeaderGroup,
} from 'react-table';
import { Fragment, Dispatch, SetStateAction } from 'react';
import {
  addMonths,
  addWeeks,
  addYears,
  subMonths,
  subWeeks,
  subYears,
} from 'date-fns';
import classnames from 'classnames';

import styles from './Calendar.module.scss';

export interface CalendarProps<T extends object> extends Styleable {
  columns: ColumnWithStrictAccessor<T>[];
  data: T[];
  onSetSelectedDate: Dispatch<SetStateAction<Date>>;
  renderWeek(): React.ReactNode;
  renderColumnHeader(column: HeaderGroup<T>): React.ReactNode;
  renderRowHeader?(row: Row<T>): React.ReactNode;
  renderCell(cell: Cell<T>): React.ReactNode;
}

function Calendar<T extends object>({
  columns,
  data,
  onSetSelectedDate,
  renderWeek,
  renderColumnHeader,
  renderCell,
  renderRowHeader,
  className,
  style,
}: React.PropsWithChildren<CalendarProps<T>>): React.ReactElement {
  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow,
  } = useTable({ columns, data });

  return (
    <div className={classnames(styles.wrapper, className)} style={style}>
      <div className={styles.navigation}>
        <div className={styles.previousWrapper}>
          <button
            onClick={() => onSetSelectedDate((date) => subYears(date, 1))}
          >
            Previous year
          </button>
          <button
            onClick={() => onSetSelectedDate((date) => subMonths(date, 1))}
          >
            Previous month
          </button>
          <button
            onClick={() => onSetSelectedDate((date) => subWeeks(date, 1))}
          >
            Previous week
          </button>
        </div>
        <p data-testid="selectedWeek">{renderWeek()}</p>
        <div className={styles.nextWrapper}>
          <button
            onClick={() => onSetSelectedDate((date) => addWeeks(date, 1))}
          >
            Next week
          </button>
          <button
            onClick={() => onSetSelectedDate((date) => addMonths(date, 1))}
          >
            Next month
          </button>
          <button
            onClick={() => onSetSelectedDate((date) => addYears(date, 1))}
          >
            Next year
          </button>
        </div>
      </div>
      <div className={styles.tableWrapper}>
        <table {...getTableProps()} className={styles.table}>
          <thead>
            {headerGroups.map((headerGroup) => (
              <tr {...headerGroup.getHeaderGroupProps()}>
                <>
                  {headerGroup.headers.map((column, index) => {
                    return (
                      <Fragment key={index}>
                        {renderRowHeader && index === 0 && <th></th>}
                        <th {...column.getHeaderProps()}>
                          {renderColumnHeader({ ...column })}
                        </th>
                      </Fragment>
                    );
                  })}
                </>
              </tr>
            ))}
          </thead>
          <tbody {...getTableBodyProps()}>
            {rows.map((row) => {
              prepareRow(row);

              return (
                <tr {...row.getRowProps()}>
                  {renderRowHeader && <td>{renderRowHeader(row)}</td>}
                  {row.cells.map((cell) => {
                    return (
                      <td {...cell.getCellProps()} className={styles.td}>
                        {renderCell(cell)}
                      </td>
                    );
                  })}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Calendar;
