import styled from 'styled-components';

const MealPlanPageWrapper = styled.div({
  display: 'flex',
  flexDirection: 'column',
});

const MealPlanHeader = styled.h1({
  display: 'flex',
  justifyContent: 'center',
});

const MealPlanPage: React.FC<{}> = () => (
  <MealPlanPageWrapper>
    <MealPlanHeader>Weekly Meal Plan</MealPlanHeader>
  </MealPlanPageWrapper>
);

export default MealPlanPage;
