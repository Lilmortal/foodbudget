import { useRef } from 'react';
import classnames from 'classnames';
import {
  useDrag,
  useDrop,
  DragObjectWithType,
  DropTargetMonitor,
} from 'react-dnd';

import styles from './DraggableCell.module.scss';

interface CollectedType {
  isOver: boolean;
  canDrop: boolean;
}

export interface DraggableCellProps<T extends object> extends Styleable {
  canDrag(): boolean;
  canDrop(item: T, monitor: DropTargetMonitor): boolean;
  onMoveCell(
    sourceCell: T & DragObjectWithType,
    destCell: T & DragObjectWithType,
  ): void;
}

function DraggableCell<T extends object>(
  props: T & React.PropsWithChildren<DraggableCellProps<T>>,
): React.ReactElement {
  const type = 'Cell';
  const ref = useRef<HTMLDivElement>(null);

  const {
    canDrag,
    canDrop: onCanDrop,
    onMoveCell,
    className,
    style,
    children,
  } = props;
  const [{ isDragging }, dragRef] = useDrag({
    item: { ...props, type },
    canDrag,
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  });

  const handleMoveCell = (droppedCell: T & DragObjectWithType) => {
    const sourceCell = droppedCell;
    const destCell: T & DragObjectWithType = { type, ...props };

    onMoveCell(sourceCell, destCell);
  };

  const [{ isOver, canDrop }, dropRef] = useDrop<
    T & DragObjectWithType,
    void,
    CollectedType
  >({
    accept: type,
    canDrop: onCanDrop,
    drop: (item) => handleMoveCell(item),
    collect: (monitor) => ({
      isOver: !!monitor.isOver(),
      canDrop: !!monitor.canDrop(),
    }),
  });

  dragRef(ref);
  dropRef(ref);

  return (
    <div
      ref={ref}
      className={classnames(styles.draggableCell, className)}
      style={style}
    >
      {isOver && canDrop && <div className={styles.hoveredPanel}></div>}
      {!isDragging && children}
    </div>
  );
}

export default DraggableCell;
