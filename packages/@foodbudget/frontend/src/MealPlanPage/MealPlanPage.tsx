import styled from 'styled-components';
import Button from 'components/Button';
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

const MealPlanPage: React.FC<{}> = () => (
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

      <Scroller>
        <Recipe />
        <Recipe />
        <Recipe />
        <Recipe />
      </Scroller>

      <IngredientPanel>
        <EditHeader>Edit</EditHeader>
        <IngredientList>
          <Button showCloseIcon>Eggs</Button>
        </IngredientList>
      </IngredientPanel>
    </MealPlanPageWrapper>
  </PageTemplate>
);

export default MealPlanPage;
