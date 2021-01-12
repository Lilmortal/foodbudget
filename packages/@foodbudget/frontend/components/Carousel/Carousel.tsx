import { useRef, useState, useEffect } from 'react';
import { v4 } from 'uuid';
import { useSwipeable } from 'react-swipeable';
import { LeftArrow, RightArrow } from './Arrow';
import Slide from './Slide';
import Slider from './Slider';
import useCarouselBreakpoints, { Breakpoints } from './useCarouselBreakpoints';
import usePrevious from '../usePrevious';
import {
  CarouselWrapper,
  SlideWrapper,
  LeftArrowWrapper,
  RightArrowWrapper,
} from './Carousel.Styled';

export interface CarouselProps {
  breakpoints: Breakpoints;
  horizontal?: boolean;
  loadMore?(): void;
  swipeable?: boolean;
  children: React.ReactNode[];
  removeArrowsOnDeviceType?: string[];
  numberOfSlidesPerSwipe?: number;
  hasMore?: boolean;
  renderLeftArrow?: React.ReactElement;
  renderRightArrow?: React.ReactElement;
}

const Carousel: React.FC<CarouselProps> = ({
  breakpoints,
  horizontal = true,
  swipeable = true,
  loadMore,
  children,
  removeArrowsOnDeviceType,
  numberOfSlidesPerSwipe = 1,
  hasMore,
  renderLeftArrow = <LeftArrow />,
  renderRightArrow = <RightArrow />,
}) => {
  const [leftArrowWidth, setLeftArrowWidth] = useState(0);
  const [rightArrowWidth, setRightArrowWidth] = useState(0);
  const sliderRef = useRef<HTMLDivElement>(null);
  const leftArrowRef = useRef<HTMLDivElement>(null);
  const rightArrowRef = useRef<HTMLDivElement>(null);
  const { breakpointName, numberOfVisibleSlides } = useCarouselBreakpoints(
    breakpoints,
  );
  const prevNumberOfVisibleSlides = usePrevious(numberOfVisibleSlides);

  const [endOfVisibleSlidePosition, setEndOfVisibleSlidePosition] = useState(
    numberOfVisibleSlides,
  );

  const prevEndOfVisibleSlidePosition = usePrevious(endOfVisibleSlidePosition);

  const shouldRemoveArrows = removeArrowsOnDeviceType?.includes(breakpointName);

  // If the numberOfVisibleSlides change via window resize, adjust the number of slides to be shown
  // accordingly.
  useEffect(() => {
    if (prevNumberOfVisibleSlides && prevEndOfVisibleSlidePosition) {
      setEndOfVisibleSlidePosition(
        prevEndOfVisibleSlidePosition -
          (prevNumberOfVisibleSlides - numberOfVisibleSlides),
      );
    } else {
      setEndOfVisibleSlidePosition(numberOfVisibleSlides);
    }
  }, [numberOfVisibleSlides]);

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
    endOfVisibleSlidePosition + numberOfSlidesPerSwipe >= children.length;

  const handleArrowClick = (direction: 'left' | 'right') => {
    if (direction === 'left' && endOfVisibleSlidePosition > 0) {
      setEndOfVisibleSlidePosition(
        Math.max(
          numberOfVisibleSlides,
          endOfVisibleSlidePosition - numberOfSlidesPerSwipe,
        ),
      );
    }

    if (direction === 'right') {
      if (willSwipeOverflow) {
        if (hasMore && loadMore) {
          loadMore();
          setEndOfVisibleSlidePosition(
            endOfVisibleSlidePosition + numberOfSlidesPerSwipe,
          );
        }

        // Since we know hasMore is false, there is nothing further ahead, hence we want the slider to not have any gaps
        // at the end.
        if (!hasMore) {
          setEndOfVisibleSlidePosition(children.length);
        }
      } else {
        setEndOfVisibleSlidePosition(
          endOfVisibleSlidePosition + numberOfSlidesPerSwipe,
        );
      }
    }
  };

  const handleLeftArrowClick = () => handleArrowClick('left');

  const handleRightArrowClick = () => handleArrowClick('right');

  let handleSwipeable;
  if (swipeable) {
    handleSwipeable = useSwipeable({
      onSwipedLeft: () => handleArrowClick('right'),
      onSwipedRight: () => handleArrowClick('left'),
      preventDefaultTouchmoveEvent: true,
      trackMouse: true,
    });
  }

  /**
   * Given a list of slides, group the number of visible slides under the slide wrapper depending on
   * numberOfVisibleSlides props, this is so we can use flexGrow: 1 to even out the spacing accordingly.
   *
   * example:
   *
   * numberOfVisibleSlides = 3;
   *
   * <SlideWrapper>
   *  <Slide style={{ flexGrow: 1 }} />
   *  <Slide style={{ flexGrow: 1 }} />
   *  <Slide style={{ flexGrow: 1 }} />
   * </SlideWrapper>
   *
   * <SlideWrapper>
   *  <Slide style={{ flexGrow: 1 }} hidden />
   *  <Slide style={{ flexGrow: 1 }} hidden />
   *  <Slide style={{ flexGrow: 1 }} hidden />
   * </SlideWrapper>
   *
   */
  const groupSlidesByNumberOfVisibleSlides = (
    slideWrappers: React.ReactNode[][],
    slide: React.ReactNode,
    index: number,
  ) => {
    const nearestVisibleSlideWrapper = Math.floor(
      index / numberOfVisibleSlides,
    );

    if (index === 0 || index % numberOfVisibleSlides === 0) {
      slideWrappers.push([slide]);
    } else if (
      numberOfVisibleSlides !== 0 &&
      index % numberOfVisibleSlides !== 0
    ) {
      // eslint-disable-next-line no-param-reassign
      slideWrappers[nearestVisibleSlideWrapper] = slideWrappers[
        nearestVisibleSlideWrapper
      ].concat([slide]);
    }

    // Populate the end of the slider with empty Slide to even out spacing
    if (index + 1 === children.length) {
      for (let i = 1; i < numberOfVisibleSlides; i += 1) {
        if (slideWrappers[nearestVisibleSlideWrapper][i] === undefined) {
          // eslint-disable-next-line no-param-reassign
          slideWrappers[nearestVisibleSlideWrapper][i] = <Slide />;
        }
      }
    }

    return slideWrappers;
  };

  const getSlidePosition = (slidesIndex: number, slideIndex: number) =>
    slidesIndex * numberOfVisibleSlides + slideIndex;

  const isSlideVisible = (slidesIndex: number, slideIndex: number) =>
    getSlidePosition(slidesIndex, slideIndex) >=
      endOfVisibleSlidePosition - numberOfVisibleSlides &&
    getSlidePosition(slidesIndex, slideIndex) <= endOfVisibleSlidePosition - 1;

  return (
    <CarouselWrapper horizontal={horizontal} {...handleSwipeable}>
      {!shouldRemoveArrows && (
        <LeftArrowWrapper ref={leftArrowRef} onClick={handleLeftArrowClick}>
          {renderLeftArrow}
        </LeftArrowWrapper>
      )}
      <Slider
        leftArrowWidth={leftArrowWidth}
        rightArrowWidth={rightArrowWidth}
        ref={sliderRef}
        endOfVisibleSlidePosition={endOfVisibleSlidePosition}
        numberOfVisibleSlides={numberOfVisibleSlides}
      >
        {children
          .reduce<React.ReactNode[][]>(groupSlidesByNumberOfVisibleSlides, [])
          .map((slides, slidesIndex) => (
            <SlideWrapper key={v4()}>
              {slides.map((slide, slideIndex) => (
                <Slide key={v4()}>
                  {isSlideVisible(slidesIndex, slideIndex) ? slide : null}
                </Slide>
              ))}
            </SlideWrapper>
          ))}
      </Slider>
      {!shouldRemoveArrows && (
        <RightArrowWrapper ref={rightArrowRef} onClick={handleRightArrowClick}>
          {renderRightArrow}
        </RightArrowWrapper>
      )}
    </CarouselWrapper>
  );
};

export default Carousel;
