import { getDay, subDays } from 'date-fns';

export type Day =
  | 'Sunday'
  | 'Monday'
  | 'Tuesday'
  | 'Wednesday'
  | 'Thursday'
  | 'Friday'
  | 'Saturday';

export const mappedDayToText: { [day: number]: Day } = {
  0: 'Sunday',
  1: 'Monday',
  2: 'Tuesday',
  3: 'Wednesday',
  4: 'Thursday',
  5: 'Friday',
  6: 'Saturday',
};

export const getSunday = (fullDate: Date): Date => {
  const day = getDay(fullDate);
  const sunday = subDays(fullDate, day);
  return sunday;
};
