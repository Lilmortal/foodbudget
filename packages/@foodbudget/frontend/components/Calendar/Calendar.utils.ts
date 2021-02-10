import { getDay, subDays } from 'date-fns';

export const getSunday = (fullDate: Date): Date => {
  const day = getDay(fullDate);
  const sunday = subDays(fullDate, day);
  return sunday;
};
