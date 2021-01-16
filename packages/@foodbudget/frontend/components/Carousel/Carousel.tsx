import { useRef, useState, useEffect, cloneElement, useCallback } from 'react';
import { SwipeableHandlers, useSwipeable } from 'react-swipeable';
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

// TODO:
// first slide lose focus on resize
// triggering left and right arrow on keyboard overtime will cause weird bugs
// width / 3 == 33.3333%, translateX not accurate
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
  const sliderRef = useRef<HTMLDivElement>(null);
  const leftArrowRef = useRef<HTMLDivElement>(null);
  const rightArrowRef = useRef<HTMLDivElement>(null);
  const slidesRef = useRef<HTMLDivElement[]>([]);

  /**
   * This is only used in the situation where user navigates with the arrow keys via keyboard.
   * If user press Enter or Spacebar on the right arrow, focus on the first visible slide, vice versa
   * for the left arrow.
   */
  const focusSlidePosition = useRef<number | null>(null);

  const { breakpointName, numberOfVisibleSlides } = useCarouselBreakpoints(
    breakpoints,
  );

  /**
   * Used to center the arrows on the left/right border of the carousel.
   */
  const [leftArrowWidth, setLeftArrowWidth] = useState(0);
  const [rightArrowWidth, setRightArrowWidth] = useState(0);

  /**
   * e.g. 4 visible slides on the screen, this returns 3.
   * index starts at 0.
   */
  const [endOfVisibleSlidePosition, setEndOfVisibleSlidePosition] = useState(
    numberOfVisibleSlides - 1,
  );

  const prevNumberOfVisibleSlides = usePrevious(numberOfVisibleSlides);

  const prevEndOfVisibleSlidePosition = usePrevious(endOfVisibleSlidePosition);

  const shouldRemoveArrows = removeArrowsOnDeviceType?.includes(breakpointName);

  /**
   * Focus on the first/last slide when user navigate via keyboard.
   */
  useEffect(() => {
    if (focusSlidePosition && focusSlidePosition.current) {
      const isFocusSlideOnLastVisibleSlide =
        prevNumberOfVisibleSlides &&
        focusSlidePosition.current &&
        focusSlidePosition.current % (prevNumberOfVisibleSlides - 1) === 0;

      const isBreakpointSmallerOnBrowserResize =
        prevNumberOfVisibleSlides &&
        numberOfVisibleSlides < prevNumberOfVisibleSlides;

      /**
       * If the focus slide is on the last visible slide when browser resize such that the breakpoint is smaller,
       * then shift the focus to the previous tab since the last visible slide will be out of view.
       */
      if (
        isFocusSlideOnLastVisibleSlide &&
        isBreakpointSmallerOnBrowserResize &&
        slidesRef.current[focusSlidePosition.current - 1] &&
        slidesRef.current[focusSlidePosition.current - 1].firstChild
      ) {
        (slidesRef.current[focusSlidePosition.current - 1]
          .firstChild as HTMLElement).focus();
      } else if (
        slidesRef.current[focusSlidePosition.current] &&
        slidesRef.current[focusSlidePosition.current].firstChild
      ) {
        (slidesRef.current[focusSlidePosition.current]
          .firstChild as HTMLElement).focus();
      }

      focusSlidePosition.current = null;
    }
  }, [
    endOfVisibleSlidePosition,
    numberOfVisibleSlides,
    prevNumberOfVisibleSlides,
  ]);

  /**
   * If the numberOfVisibleSlides change via window resize, adjust the number of slides to be shown accordingly.
   */
  useEffect(() => {
    if (prevNumberOfVisibleSlides && prevEndOfVisibleSlidePosition) {
      setEndOfVisibleSlidePosition(
        prevEndOfVisibleSlidePosition -
          (prevNumberOfVisibleSlides - numberOfVisibleSlides),
      );
    } else {
      setEndOfVisibleSlidePosition(numberOfVisibleSlides);
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
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

  const handleLeftArrowKeyPress = (
    event: React.KeyboardEvent<HTMLButtonElement>,
  ) => {
    if (event.key === 'Enter' || event.key === ' ') {
      /**
       * The focus slide should be on the slide that was not on the previous list of slides.
       */
      focusSlidePosition.current = Math.max(
        numberOfVisibleSlides - 1,
        endOfVisibleSlidePosition - numberOfVisibleSlides,
      );
    }
  };

  const handleRightArrowKeyPress = (
    event: React.KeyboardEvent<HTMLButtonElement>,
  ) => {
    if (event.key === 'Enter' || event.key === ' ') {
      focusSlidePosition.current = endOfVisibleSlidePosition;
    }
  };

  const handleLeftArrowClick = () => handleArrowClick('left');

  const handleRightArrowClick = () => handleArrowClick('right');

  let handleSwipeable: SwipeableHandlers | undefined = useSwipeable({
    onSwipedLeft: () => handleArrowClick('right'),
    onSwipedRight: () => handleArrowClick('left'),
    preventDefaultTouchmoveEvent: true,
    trackMouse: true,
  });

  if (!swipeable) {
    handleSwipeable = undefined;
  }

  const leftArrow = cloneElement(renderLeftArrow, {
    disabled: endOfVisibleSlidePosition === numberOfVisibleSlides,
    onClick: handleLeftArrowClick,
    onKeyPress: handleLeftArrowKeyPress,
  });

  const rightArrow = cloneElement(renderRightArrow, {
    disabled: !hasMore && endOfVisibleSlidePosition === children.length,
    onClick: handleRightArrowClick,
    onKeyPress: handleRightArrowKeyPress,
  });

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

  const isSlideVisible = (slidesIndex: number, slideIndex: number) => {
    return (
      getSlidePosition(slidesIndex, slideIndex) >=
        endOfVisibleSlidePosition - numberOfVisibleSlides &&
      getSlidePosition(slidesIndex, slideIndex) <= endOfVisibleSlidePosition - 1
    );
  };

  /**
   * Set focusSlidePosition ref as the previous focussed slide.
   */
  const onSlideUnmount = useCallback(
    (activeElement: React.ReactNode, node: HTMLDivElement) => {
      if (activeElement === node.firstChild) {
        slidesRef.current.find((slideNode, index) => {
          if (node.firstChild === slideNode?.firstChild) {
            focusSlidePosition.current = index;
            return true;
          }
          return false;
        });
      }
    },
    [],
  );

  return (
    <CarouselWrapper horizontal={horizontal} {...handleSwipeable}>
      {!shouldRemoveArrows && (
        <LeftArrowWrapper ref={leftArrowRef}>{leftArrow}</LeftArrowWrapper>
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
            <SlideWrapper key={slidesIndex}>
              {slides.map((slide, slideIndex) => (
                <Slide
                  key={getSlidePosition(slidesIndex, slideIndex)}
                  ref={(node: HTMLDivElement) => {
                    slidesRef.current[
                      getSlidePosition(slidesIndex, slideIndex)
                    ] = node;
                  }}
                  onUnmount={(activeElement: React.ReactNode) => {
                    return onSlideUnmount(
                      activeElement,
                      slidesRef.current[
                        getSlidePosition(slidesIndex, slideIndex)
                      ],
                    );
                  }}
                >
                  {isSlideVisible(slidesIndex, slideIndex) ? slide : null}
                </Slide>
              ))}
            </SlideWrapper>
          ))}
      </Slider>
      {!shouldRemoveArrows && (
        <RightArrowWrapper ref={rightArrowRef}>{rightArrow}</RightArrowWrapper>
      )}
    </CarouselWrapper>
  );
};

export default Carousel;
