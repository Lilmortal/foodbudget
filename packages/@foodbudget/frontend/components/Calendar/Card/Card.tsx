import { useRef } from 'react';
import classnames from 'classnames';
import { useDrag, useDrop, DragObjectWithType } from 'react-dnd';

import { getDate } from 'date-fns';
import styles from './Card.module.scss';
import { Period } from '../Calendar';

interface CollectedType {
  isOver: boolean;
  canDrop: boolean;
}

interface CardDropType extends CardProps, DragObjectWithType {}

export interface CardProps {
  fullDate: Date;
  period: Period;
  children: React.ReactNode;
}

export interface CardFullProps extends CardProps, Styleable {
  onMoveCard(sourceCard: CardProps, destCard: CardProps): void;
}

const Card: React.FC<CardFullProps> = ({
  fullDate,
  period,
  onMoveCard,
  className,
  style,
  children,
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const [{ isDragging }, dragRef] = useDrag({
    item: { fullDate, children, period, type: 'Image' },
    canDrag: () => {
      const element = children as React.ReactElement;
      // Only allow drag if there is a recipe
      if (element.props.recipe) {
        return true;
      }
      return false;
    },
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  });

  const moveImage = (droppedCard: CardDropType) => {
    const sourceCard = droppedCard;
    const destCard: CardProps = { fullDate, children, period };

    onMoveCard(sourceCard, destCard);
  };

  const [{ isOver, canDrop }, dropRef] = useDrop<
    CardDropType,
    void,
    CollectedType
  >({
    accept: 'Image',
    canDrop: (item) => {
      // if hovering over the selected card
      if (fullDate === item.fullDate && period === item.period) {
        return false;
      }

      return true;
    },
    drop: (item) => moveImage(item),
    collect: (monitor) => ({
      isOver: !!monitor.isOver(),
      canDrop: !!monitor.canDrop(),
    }),
  });

  dragRef(ref);
  dropRef(ref);

  const dateNum = getDate(new Date(fullDate));

  return (
    <div ref={ref} className={classnames(styles.card, className)} style={style}>
      {(!isDragging || canDrop) && <div className={styles.date}>{dateNum}</div>}
      {isOver && canDrop && <div className={styles.hoveredCard}></div>}
      {!isDragging && children}
    </div>
  );
};

export default Card;
