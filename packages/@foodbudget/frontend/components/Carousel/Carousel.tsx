import { useRef, useState, useEffect } from 'react';
import styled from 'styled-components';
import { ArrowWrapper, LeftArrow, RightArrow } from './Arrow';
import Slide from './Slide';
import Slider from './Slider';

const LeftArrowWrapper = styled(ArrowWrapper)({
  left: 0,
});

const RightArrowWrapper = styled(ArrowWrapper)({
  right: 0,
});

const CarouselWrapper = styled.div<Pick<CarouselProps, 'horizontal'>>(
  (props) => ({
    display: 'flex',
    flexDirection: props.horizontal ? 'row' : 'column',
    position: 'relative',
  }),
);

export interface CarouselProps {
  horizontal?: boolean;
  loadMore?(): void;
  draggable?: boolean;
  children: React.ReactNode[];
  removeArrowOnDeviceType?: string[]; // Make it generic
  numberOfSlidesPerSwipe?: number;
  hasMore?: boolean;
  renderLeftArrow?: React.ReactElement;
  renderRightArrow?: React.ReactElement;
  onDrag?(): void;
}

// TODO:
// Disable onClick when moving
// Disable tab when not in view
const Carousel: React.FC<CarouselProps> = ({
  horizontal = true,
  loadMore,
  children,
  numberOfSlidesPerSwipe = 1,
  hasMore,
  renderLeftArrow = <LeftArrow />,
  renderRightArrow = <RightArrow />,
}) => {
  const [sliderWidth, setSliderWidth] = useState(0);
  const [slideWidth, setSlideWidth] = useState(0);
  const [leftArrowWidth, setLeftArrowWidth] = useState(0);
  const [rightArrowWidth, setRightArrowWidth] = useState(0);
  const [position, setPosition] = useState(4);
  const sliderRef = useRef<HTMLDivElement>(null);
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
    const sliderRefWidth = sliderRef.current?.offsetWidth;

    if (sliderRefWidth) {
      setSliderWidth(sliderRefWidth);
    }
  }, [sliderRef]);

  useEffect(() => {
    setSlideWidth(sliderWidth / 4);
  }, [sliderWidth]);

  // move this to useReducer
  const handleArrowClick = (direction: 'left' | 'right') => {
    if (direction === 'left' && position > 0) {
      setPosition(position - numberOfSlidesPerSwipe);
    }

    if (direction === 'right') {
      if (position + numberOfSlidesPerSwipe >= children.length) {
        if (hasMore && loadMore) {
          loadMore();
          setPosition(position + numberOfSlidesPerSwipe);
        }

        if (!hasMore) {
          setPosition(children.length);
        }
      } else {
        setPosition(position + numberOfSlidesPerSwipe);
      }
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
      <Slider
        leftArrowWidth={leftArrowWidth}
        rightArrowWidth={rightArrowWidth}
        ref={sliderRef}
        numberOfSlidesPerSwipe={numberOfSlidesPerSwipe}
        slideWidth={slideWidth}
      >
        {children.map((child) => (
          <Slide width={slideWidth} numberOfVisibleItems={4}>
            {child}
          </Slide>
        ))}
      </Slider>
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

// const responsive = {
//   xl: {
//     breakpoint: { max: 4000, min: 3000 },
//     items: 5,
//   },
//   lg: {
//     breakpoint: { max: 3000, min: 1024 },
//     items: 3,
//   },
//   md: {
//     breakpoint: { max: 1024, min: 464 },
//     items: 2,
//   },
//   sm: {
//     breakpoint: { max: 464, min: 0 },
//     items: 1,
//   },
// };
