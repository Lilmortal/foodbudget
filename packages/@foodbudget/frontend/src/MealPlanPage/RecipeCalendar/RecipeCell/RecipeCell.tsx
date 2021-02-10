import classnames from 'classnames';
import { Period } from '../RecipeCalendar.utils';

import styles from './RecipeCell.module.scss';

export interface Recipe {
  fullDate: Date;
  period: Period;
  source: string | null | undefined;
}

export interface RecipeCellProps extends Styleable {
  onClick(recipe: Recipe): void;
  onRemoveRecipe?(recipe: Recipe): void;
  recipe: Recipe;
}

const RecipeCell: React.FC<RecipeCellProps> = ({
  onClick,
  onRemoveRecipe,
  recipe,
  className,
  style,
}) => {
  const handleOnClick = () => {
    onClick(recipe);
  };

  const handleOnRemoveRecipe = () => {
    if (onRemoveRecipe) {
      onRemoveRecipe(recipe);
    }
  };

  let backgroundImage;
  if (recipe.source) {
    backgroundImage = `url(${recipe.source})`;
  }

  return (
    <div
      onClick={handleOnClick}
      className={classnames(styles.recipeCell, className)}
      style={{ backgroundImage, ...style }}
    >
      {onRemoveRecipe && recipe.source && (
        <div onClick={handleOnRemoveRecipe}>X</div>
      )}
      Test
    </div>
  );
};

export default RecipeCell;
