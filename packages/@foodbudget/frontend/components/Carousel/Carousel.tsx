import { useRef, useState, useEffect } from 'react';
import styled from 'styled-components';
import { v4 } from 'uuid';
import { ArrowWrapper, LeftArrow, RightArrow } from './Arrow';
import Slide from './Slide';
import Slider from './Slider';
import useVisibleSlides, { Responsives } from './useVisibleSlides';

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

const SlideWrapper = styled.div({
  display: 'flex',
  minWidth: '100%',
});

export interface CarouselProps {
  breakpoints: Responsives;
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
  breakpoints,
  horizontal = true,
  loadMore,
  children,
  numberOfSlidesPerSwipe = 1,
  hasMore,
  renderLeftArrow = <LeftArrow />,
  renderRightArrow = <RightArrow />,
}) => {
  const [leftArrowWidth, setLeftArrowWidth] = useState(0);
  const [rightArrowWidth, setRightArrowWidth] = useState(0);
  const [position, setPosition] = useState(0);
  const sliderRef = useRef<HTMLDivElement>(null);
  const leftArrowRef = useRef<HTMLDivElement>(null);
  const rightArrowRef = useRef<HTMLDivElement>(null);

  const numberOfVisibleSlides = useVisibleSlides(breakpoints);

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

  const willSwipeOverflow =
    numberOfVisibleSlides + position + numberOfSlidesPerSwipe >=
    children.length;

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
          setPosition(children.length - numberOfVisibleSlides);
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
        numberOfVisibleSlides={numberOfVisibleSlides}
      >
        {children
          .reduce<React.ReactNode[][]>((acc, current, index) => {
            // Put all visible slides under the slide wrapper, this is so we can use flexGrow: 1 to
            // even out the spacing accordingly
            const nearestVisibleSlideWrapper = Math.floor(
              index / numberOfVisibleSlides,
            );

            if (index === 0 || index % numberOfVisibleSlides === 0) {
              acc.push([current]);
            } else if (
              numberOfVisibleSlides !== 0 &&
              index % numberOfVisibleSlides !== 0
            ) {
              acc[nearestVisibleSlideWrapper] = acc[
                nearestVisibleSlideWrapper
              ].concat([current]);
            }

            // Populate the end of the slider with empty Slide to even out spacing
            if (index + 1 === children.length) {
              for (let i = 1; i < numberOfVisibleSlides; i += 1) {
                if (acc[nearestVisibleSlideWrapper][i] === undefined) {
                  acc[nearestVisibleSlideWrapper][i] = <Slide />;
                }
              }
            }

            return acc;
          }, [])
          .map((slides) => (
            <SlideWrapper>
              {slides.map((slide) => (
                <Slide key={v4()}>{slide}</Slide>
              ))}
            </SlideWrapper>
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
