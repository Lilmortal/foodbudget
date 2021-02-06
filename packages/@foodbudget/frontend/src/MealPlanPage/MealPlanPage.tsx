import { useState, useRef } from 'react';
import Button from 'components/Button';
import classnames from 'classnames';
import MainPage from '../templates/MainPage';

import styles from './MealPlanPage.module.scss';
import RecipeModal from './RecipeModal';
import { Recipe } from './RecipeCalendar/RecipeCell/RecipeCell';
import RecipeCalendar, { RecipeCalendarData } from './RecipeCalendar';
import { Period } from './RecipeCalendar/RecipeCalendar.utils';

interface BudgetBalanceProps {
  header: string;
}

const BudgetBalance: React.FC<BudgetBalanceProps> = ({ header, children }) => (
  <div className={styles.balanceWrapper}>
    <p>{header}</p>

    {children}
  </div>
);

export type MealPlanPageProps = Styleable;

const MealPlanPage: React.FC<MealPlanPageProps> = ({ className, style }) => {
  const [isRecipeModalOpen, setRecipeModalOpen] = useState(false);
  const selectedRecipe = useRef<Recipe>();

  const handleOnCloseRecipeModal = () => {
    setRecipeModalOpen(false);
    selectedRecipe.current = undefined;
  };

  const handleOnRecipeCellClick = (recipe: Recipe) => {
    setRecipeModalOpen(true);
    selectedRecipe.current = recipe;
  };

  const [recipes, setRecipes] = useState<RecipeCalendarData>({});

  const handleOnRecipeCardClick = (source: string) => {
    const updatedRecipes = { ...recipes };
    if (selectedRecipe.current) {
      updatedRecipes[selectedRecipe.current.fullDate.toDateString()] = {
        ...updatedRecipes[selectedRecipe.current.fullDate.toDateString()],
        [selectedRecipe.current.period as Period]: source,
      };

      setRecipes((prevRecipes) => ({ ...prevRecipes, ...updatedRecipes }));
      setRecipeModalOpen(false);
    }
  };

  const handleOnMoveRecipe = (updatedRecipes: RecipeCalendarData) =>
    setRecipes((prevRecipes) => ({ ...prevRecipes, ...updatedRecipes }));

  return (
    <MainPage>
      <h1>Weekly Meal Plan</h1>

      <div className={classnames(styles.wrapper, className)} style={style}>
        <RecipeCalendar
          recipes={recipes}
          className={styles.calendar}
          onMoveRecipe={handleOnMoveRecipe}
          onRecipeCellClick={handleOnRecipeCellClick}
        />

        <div className={styles.budgetBalanceWrapper}>
          <div className={styles.budgetBalancePanel}>
            <BudgetBalance header="Meal Plan Cost">$xxx.xx</BudgetBalance>
            <BudgetBalance header="Budget Remaining">$xxx.xx</BudgetBalance>
          </div>
        </div>

        <div className={classnames(styles.panel)}>
          <p>Edit</p>
          <div>
            <Button showCloseIcon>Eggs</Button>
          </div>
        </div>
      </div>

      <RecipeModal
        open={isRecipeModalOpen}
        onRecipeClick={handleOnRecipeCardClick}
        onClose={handleOnCloseRecipeModal}
      />
    </MainPage>
  );
};

export default MealPlanPage;
