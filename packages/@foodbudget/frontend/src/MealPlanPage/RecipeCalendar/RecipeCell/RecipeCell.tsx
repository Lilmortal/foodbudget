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
  recipe: Recipe;
}

const RecipeCell: React.FC<RecipeCellProps> = ({
  onClick,
  recipe,
  className,
  style,
}) => {
  const handleOnClick = () => {
    onClick(recipe);
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
      Test
    </div>
  );
};

export default RecipeCell;
