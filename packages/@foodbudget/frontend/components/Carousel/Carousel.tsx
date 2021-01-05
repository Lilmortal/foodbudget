import { useRef, useState, useEffect } from 'react';
import styled from 'styled-components';
import { v4 } from 'uuid';
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
  removeArrowOnDeviceType?: string[];
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
  const [position, setPosition] = useState(0);
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

  const willSwipeOverflow =
    4 + position + numberOfSlidesPerSwipe >= children.length;

  // move this to useReducer if we want to include the ability to 'jump'
  const handleArrowClick = (direction: 'left' | 'right') => {
    if (direction === 'left' && position > 0) {
      setPosition(Math.max(0, position - numberOfSlidesPerSwipe));
    }

    if (direction === 'right') {
      if (willSwipeOverflow) {
        if (hasMore && loadMore) {
          loadMore();
          setPosition(position + numberOfSlidesPerSwipe);
        }

        // Since we know hasMore is false, there is nothing further ahead, hence we want the slider to not have any gaps
        // at the end.
        if (!hasMore) {
          // Negate 1 because position starts at 0, and negate numberOfSlidesPerSwipe because we want to move the last slide
          // to be at the end, and not at the start.
          setPosition(children.length - 1 - numberOfSlidesPerSwipe);
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
        position={position}
        slideWidth={slideWidth}
      >
        {children.map((child) => (
          <Slide width={slideWidth} numberOfVisibleItems={4} key={v4()}>
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
