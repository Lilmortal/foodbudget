import styled from 'styled-components';
import { useState } from 'react';
import Button from 'components/Button';
import Carousel from 'components/Carousel';
import PageTemplate from '../templates/Page';
import Timetable from './Timetable';

const MealPlanPageWrapper = styled.div({
  display: 'grid',
  padding: '0 5rem',
  gridTemplateColumns: '80% 1fr',
  gap: '5rem',
  gridTemplateAreas: `"timetable budgetBalances"
  "recipeScroller ingredientPanel"`,
});

const MealPlanHeader = styled.h1({
  display: 'flex',
  justifyContent: 'center',
  padding: '1rem',
});

const Panel = styled.div(({ theme }) => ({
  border: `1px solid ${theme.colors.primaryBorder}`,
  backgroundColor: theme.colors.white,
  padding: '2rem',
  borderRadius: '20px',
}));

const BudgetBalanceWrapper = styled.div({
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  gridArea: 'budgetBalances',
});

const BudgetBalancePanel = styled(Panel)({
  display: 'flex',
  flexDirection: 'column',
});

const BudgetBalanceTitle = styled.p({});

const BalanceWrapper = styled.div({
  display: 'flex',
  flexDirection: 'column',
  padding: '1rem 0 4rem',
});

const Scroller = styled.div(({ theme }) => ({
  gridArea: 'recipeScroller',
  border: `1px solid ${theme.colors.black}`,
  padding: '4rem 0',
  display: 'flex',
  flexWrap: 'wrap',
}));

const Recipe = styled.div(({ theme }) => ({
  border: `1px solid ${theme.colors.black}`,
  padding: '2rem',
  maxWidth: '500px',
  maxHeight: '300px',
}));

const IngredientPanel = styled(Panel)({ gridArea: 'ingredientPanel' });

const EditHeader = styled.p({});

const IngredientList = styled.div({});

const RecipeTimetable = styled(Timetable)({
  gridArea: 'timetable',
});

interface BudgetBalanceProps {
  header: string;
}

const BudgetBalance: React.FC<BudgetBalanceProps> = ({ header, children }) => (
  <BalanceWrapper>
    <BudgetBalanceTitle>{header}</BudgetBalanceTitle>

    {children}
  </BalanceWrapper>
);

const MealPlanPage: React.FC<{}> = () => {
  const [items, setItems] = useState([
    <div tabIndex={0}>1</div>,
    <div tabIndex={0}>2</div>,
    <div tabIndex={0}>3</div>,
    <div tabIndex={0}>4</div>,
    <div tabIndex={0}>5</div>,
    <div tabIndex={0}>6</div>,
  ]);

  const [hasMore, setHasMore] = useState(true);

  const loadMore = () => {
    setItems([
      ...items,
      <div tabIndex={0}>7</div>,
      <div tabIndex={0}>8</div>,
      <div tabIndex={0}>9</div>,
      <div tabIndex={0}>10</div>,
      <div tabIndex={0}>11</div>,
      <div tabIndex={0}>12</div>,
      <div tabIndex={0}>13</div>,
      <div tabIndex={0}>14</div>,
    ]);
    setHasMore(false);
  };

  return (
    <PageTemplate>
      <MealPlanHeader>Weekly Meal Plan</MealPlanHeader>

      <MealPlanPageWrapper>
        <RecipeTimetable />

        <BudgetBalanceWrapper>
          <BudgetBalancePanel>
            <BudgetBalance header="Meal Plan Cost">$xxx.xx</BudgetBalance>
            <BudgetBalance header="Budget Remaining">$xxx.xx</BudgetBalance>
          </BudgetBalancePanel>
        </BudgetBalanceWrapper>

        <Carousel
          hasMore={hasMore}
          loadMore={loadMore}
          numberOfSlidesPerSwipe={3}
          breakpoints={{
            xl: { minWidthInPixels: 1200, numberOfVisibleSlides: 4 },
            lg: { minWidthInPixels: 600, numberOfVisibleSlides: 3 },
            md: { minWidthInPixels: 0, numberOfVisibleSlides: 2 },
          }}
        >
          {items}
        </Carousel>

        <IngredientPanel>
          <EditHeader>Edit</EditHeader>
          <IngredientList>
            <Button showCloseIcon>Eggs</Button>
          </IngredientList>
        </IngredientPanel>
      </MealPlanPageWrapper>
    </PageTemplate>
  );
};

export default MealPlanPage;
