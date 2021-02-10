import classnames from 'classnames';

import styles from './RecipeCard.module.scss';

export interface RecipeCardProps extends Styleable {
  source: string;
  tabIndex?: number;
  onClick(source: string): void;
}

const RecipeCard: React.FC<RecipeCardProps> = ({
  source,
  tabIndex = 0,
  onClick,
  className,
  style,
}) => {
  const handleOnClick = () => {
    onClick(source);
  };

  let backgroundImage;
  if (source) {
    backgroundImage = `url(${source})`;
  }

  return (
    <div
      className={classnames(styles.recipeCardWrapper, className)}
      style={style}
      tabIndex={tabIndex}
    >
      <div
        className={classnames(styles.recipeCard)}
        style={{ backgroundImage }}
        onClick={handleOnClick}
      />
    </div>
  );
};

export default RecipeCard;
