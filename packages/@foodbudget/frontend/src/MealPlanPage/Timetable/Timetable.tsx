import styled from 'styled-components';

export interface TimetableProps {
  columnTitles?: (string | undefined)[];
  rowTitles?: (string | undefined)[];
  tables?: React.ReactNode[][];
}

const Grid = styled.div({
  padding: '1rem',
});

const Table = styled.div(({ theme }) => ({
  border: `1px solid ${theme.colors.black}`,
  padding: '30rem',
  backgroundColor: theme.colors.white,
}));

const Timetable: React.FC<TimetableProps> = ({
  columnTitles,
  rowTitles,
  tables,
}) => (
  <Table>
    {/* {tables.map((table) => (
      <Grid>{table}</Grid>
    ))} */}
  </Table>
);

export default Timetable;
