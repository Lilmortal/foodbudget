import { useRef, useState, useEffect } from 'react';
import Button from 'components/Button';
import styled from 'styled-components';

const Arrow = styled(Button)({
  position: 'absolute',
  zIndex: 2,
});

const LeftArrow = (props: React.ButtonHTMLAttributes<HTMLButtonElement>) => (
  <Arrow {...props}>{'<'}</Arrow>
);

const RightArrow = (props: React.ButtonHTMLAttributes<HTMLButtonElement>) => (
  <Arrow {...props} style={{ right: 0 }}>
    {'>'}
  </Arrow>
);

const ArrowWrapper = styled.div({
  position: 'absolute',
  display: 'flex',
  alignItems: 'center',
  height: '100%',
});

const LeftArrowWrapper = styled(ArrowWrapper)({
  left: 0,
});

const RightArrowWrapper = styled(ArrowWrapper)({
  right: 0,
});

interface SliderWrapperProps {
  leftArrowWidth: number;
  rightArrowWidth: number;
}

const SliderWrapper = styled.div<SliderWrapperProps>((props) => ({
  display: 'flex',
  width: '100%',
  marginLeft: `${props.leftArrowWidth / 2}px`,
  marginRight: `${props.rightArrowWidth / 2}px`,

  overflow: 'hidden',
}));

interface SliderProps {
  pos: number;
  itemWidth: number;
}

const Slider = styled.div<SliderProps>((props) => ({
  display: 'flex',
  transform: `translateX(${-1 * props.pos * props.itemWidth}px)`,
  transition: 'transform 0.5s',
}));

interface ItemProps {
  width: number;
  numberOfVisibleItems: number;
}

const Item = styled.div<ItemProps>((props) => ({
  paddingRight: '1rem',
  minWidth: `${props.width}px`,
}));

export interface CarouselProps {
  horizontal?: boolean;
  loadMore?(): void;
  draggable?: boolean;
  items: React.ReactNode[];
  removeArrowOnDeviceType?: string[]; // Make it generic
  numOfItemsToSlide?: number;
  hasMore?: boolean;
  renderLeftArrow?: React.ReactElement;
  renderRightArrow?: React.ReactElement;
  onDrag?(): void;
}

const CarouselWrapper = styled.div<Pick<CarouselProps, 'horizontal'>>(
  (props) => ({
    display: 'flex',
    flexDirection: props.horizontal ? 'row' : 'column',
    position: 'relative',
  }),
);

const responsive = {
  xl: {
    breakpoint: { max: 4000, min: 3000 },
    items: 5,
  },
  lg: {
    breakpoint: { max: 3000, min: 1024 },
    items: 3,
  },
  md: {
    breakpoint: { max: 1024, min: 464 },
    items: 2,
  },
  sm: {
    breakpoint: { max: 464, min: 0 },
    items: 1,
  },
};

// TODO:
// Disable onClick when moving
// Disable tab when not in view
const Carousel: React.FC<CarouselProps> = ({
  horizontal = true,
  loadMore,
  items,
  hasMore,
  renderLeftArrow = <LeftArrow />,
  renderRightArrow = <RightArrow />,
}) => {
  const [itemsWidth, setItemsWidth] = useState(0);
  const [itemWidth, setItemWidth] = useState(0);
  const [leftArrowWidth, setLeftArrowWidth] = useState(0);
  const [rightArrowWidth, setRightArrowWidth] = useState(0);
  const [currentPos, setCurrentPos] = useState(0);
  const itemsRef = useRef<HTMLDivElement>(null);
  const leftArrowRef = useRef<HTMLDivElement>(null);
  const rightArrowRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const leftArrowRefWidth = leftArrowRef.current?.firstElementChild?.getBoundingClientRect()
      ?.width;

    if (leftArrowRefWidth) {
      setLeftArrowWidth(leftArrowRefWidth);
    }
  }, [leftArrowRef]);

  useEffect(() => {
    const rightArrowRefWidth = rightArrowRef.current?.firstElementChild?.getBoundingClientRect()
      ?.width;

    if (rightArrowRefWidth) {
      setRightArrowWidth(rightArrowRefWidth);
    }
  }, [rightArrowRef]);

  useEffect(() => {
    const itemsRefWidth = itemsRef.current?.offsetWidth;

    if (itemsRefWidth) {
      setItemsWidth(itemsRefWidth);
    }
  }, [itemsRef]);

  useEffect(() => {
    setItemWidth(itemsWidth / 4);
  }, [itemsWidth]);

  // move this to useReducer
  const handleArrowClick = (direction: 'left' | 'right') => {
    if (direction === 'left' && currentPos > 0) {
      setCurrentPos(currentPos - 1);
    }

    if (direction === 'right' && hasMore) {
      setCurrentPos(currentPos + 1);
    }
  };

  return (
    <CarouselWrapper horizontal={horizontal}>
      <LeftArrowWrapper
        ref={leftArrowRef}
        onClick={() => handleArrowClick('left')}
      >
        {renderLeftArrow}
      </LeftArrowWrapper>
      <SliderWrapper
        leftArrowWidth={leftArrowWidth}
        rightArrowWidth={rightArrowWidth}
        ref={itemsRef}
      >
        <Slider pos={currentPos} itemWidth={itemWidth}>
          {items.map((item) => (
            <Item width={itemWidth} numberOfVisibleItems={4}>
              {item}
            </Item>
          ))}
        </Slider>
      </SliderWrapper>
      <RightArrowWrapper
        ref={rightArrowRef}
        onClick={() => handleArrowClick('right')}
      >
        {renderRightArrow}
      </RightArrowWrapper>
    </CarouselWrapper>
  );
};

export default Carousel;
