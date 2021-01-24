import { useRef } from 'react';
import { useDrag, useDrop, DragObjectWithType } from 'react-dnd';

export interface CardProps {
  row: number;
  day: string;
  date: React.ReactNode;
}

export interface CardFullProps extends CardProps {
  onMoveCard(sourceCard: CardProps, destCard: CardProps): void;
}

const Card: React.FC<CardFullProps> = ({
  row,
  day,
  date,
  onMoveCard,
  children,
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const [{ isDragging }, dragRef] = useDrag({
    item: { id: `${row}-${day}-${date}`, type: 'Image' },
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  });

  const moveImage = (i: DragObjectWithType) => {
    const [sourceRow, sourceDay, sourceDate] = i.id.split('-');
    const sourceCard: CardProps = {
      row: sourceRow,
      day: sourceDay,
      date: sourceDate,
    };
    const destCard: CardProps = { row, day, date };

    onMoveCard(sourceCard, destCard);
  };

  const [{ isOver }, dropRef] = useDrop({
    accept: 'Image',
    drop: (item) => moveImage(item),
    collect: (monitor) => ({
      isOver: !!monitor.isOver(),
    }),
  });

  dragRef(ref);
  dropRef(ref);

  return (
    <div ref={ref} style={isOver ? { backgroundColor: 'blue' } : undefined}>
      {!isDragging && children}
    </div>
  );
};

export default Card;
