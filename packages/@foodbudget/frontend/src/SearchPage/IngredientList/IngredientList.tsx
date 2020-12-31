import styled from 'styled-components';
import { v4 } from 'uuid';
import Button from 'components/Button';

const IngredientListWrapper = styled.div({
  display: 'flex',
  flexDirection: 'column',
});

const StyledIngredientList = styled.div({
  display: 'flex',
  flexWrap: 'wrap',
});

const IngredientButton = styled(Button)(({ theme }) => ({
  margin: `0 ${theme.spacing.sm} ${theme.spacing.sm} 0`,
}));

const IngredientListHeader = styled.p(({ theme }) => ({
  padding: '1rem 0',
  color: theme.colors.secondaryText,
}));

export interface IngredientListProps {
  header?: string;
  ingredients: string[];
  onClose(element: React.SyntheticEvent<HTMLButtonElement, Event>): void;
}

const IngredientList: React.FC<IngredientListProps> = ({
  header,
  ingredients,
  onClose,
}) => (
  <IngredientListWrapper>
    <IngredientListHeader>{header}</IngredientListHeader>
    <StyledIngredientList>
      {ingredients.map((ingredient: string) => (
        <IngredientButton
          type="button"
          key={`ingredient-${v4()}`}
          variant="secondary"
          showCloseIcon
          onClick={onClose}
        >
          {ingredient}
        </IngredientButton>
      ))}
    </StyledIngredientList>
  </IngredientListWrapper>
);

export default IngredientList;
