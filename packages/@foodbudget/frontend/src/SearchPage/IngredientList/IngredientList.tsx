import Button from 'components/Button';
import classnames from 'classnames';

import styles from './IngredientList.module.scss';

export interface IngredientListProps extends Styleable {
  header?: string;
  ingredients: string[];
  onClose(element: React.SyntheticEvent<HTMLButtonElement, Event>): void;
}

const IngredientList: React.FC<IngredientListProps> = ({
  header,
  ingredients,
  onClose,
  className,
  style,
}) => (
  <div className={classnames(styles.wrapper, className)} style={style}>
    <p className={classnames(styles.ingredientListHeader)}>{header}</p>
    <div className={styles.ingredientList}>
      {ingredients.map((ingredient: string, index) => (
        <Button
          className={styles.ingredientButton}
          type="button"
          key={`ingredient-${index}`}
          variant="secondary"
          showCloseIcon
          onClick={onClose}
        >
          {ingredient}
        </Button>
      ))}
    </div>
  </div>
);

export default IngredientList;
