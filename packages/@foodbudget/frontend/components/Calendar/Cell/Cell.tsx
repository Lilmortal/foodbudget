import { useRef } from 'react';
import classnames from 'classnames';
import { useDrag, useDrop, DragObjectWithType } from 'react-dnd';

import styles from './Cell.module.scss';

interface CollectedType {
  isOver: boolean;
  canDrop: boolean;
}

interface CellDropType extends CellProps, DragObjectWithType {}

export type Period = 'breakfast' | 'lunch' | 'dinner';

export interface CellProps {
  fullDate: Date;
  period: Period;
  children: React.ReactNode;
}

export interface CellFullProps extends CellProps, Styleable {
  onMoveCell(sourceCell: CellProps, destCell: CellProps): void;
}

const Cell: React.FC<CellFullProps> = ({
  fullDate,
  period,
  onMoveCell,
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

  const handleMoveCell = (droppedCell: CellDropType) => {
    const sourceCell = droppedCell;
    const destCell: CellProps = { fullDate, children, period };

    onMoveCell(sourceCell, destCell);
  };

  const [{ isOver, canDrop }, dropRef] = useDrop<
    CellDropType,
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
    drop: (item) => handleMoveCell(item),
    collect: (monitor) => ({
      isOver: !!monitor.isOver(),
      canDrop: !!monitor.canDrop(),
    }),
  });

  dragRef(ref);
  dropRef(ref);

  return (
    <div ref={ref} className={classnames(styles.cell, className)} style={style}>
      {isOver && canDrop && <div className={styles.hoveredCell}></div>}
      {!isDragging && children}
    </div>
  );
};

export default Cell;
