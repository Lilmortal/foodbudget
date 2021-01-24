import styled from 'styled-components';

export const CalendarWrapper = styled.div({
  display: 'flex',
  flexDirection: 'column',
});

export const CalendarTable = styled.table((props) => ({
  display: 'table',
  border: `1px solid ${props.theme.colors.black}`,
  padding: '1rem',
  tableLayout: 'fixed',
}));

export const CalendarHead = styled.thead({});

export const CalendarBody = styled.tbody({});

export const CalendarTr = styled.tr({});

export const CalendarTh = styled.th({});

export const CalendarTd = styled.td({
  width: `${100 / 7}%`,
});

export const NavigationWrapper = styled.div({
  display: 'flex',
  justifyContent: 'space-around',
});

export const PreviousNavigationWrapper = styled.div({
  display: 'flex',
});

export const NextNavigationWrapper = styled.div({
  display: 'flex',
});
