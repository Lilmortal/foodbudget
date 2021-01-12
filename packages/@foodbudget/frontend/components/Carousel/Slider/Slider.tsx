import usePrevious from 'components/usePrevious';
import { forwardRef, useRef } from 'react';
import styled from 'styled-components';

export interface SliderProps {
  leftArrowWidth: number;
  rightArrowWidth: number;
  numberOfVisibleSlides: number;
  endOfVisibleSlidePosition: number;
  children: React.ReactNode[];
}

const SliderWrapper = styled.div<
  Pick<SliderProps, 'leftArrowWidth' | 'rightArrowWidth'>
>((props) => ({
  display: 'flex',
  width: '100%',
  marginLeft: `${props.leftArrowWidth / 2}px`,
  marginRight: `${props.rightArrowWidth / 2}px`,

  overflow: 'hidden',
}));

const getSlideWidthInPercentages = (numberOfVisibleSlides: number) =>
  Math.round(100 / numberOfVisibleSlides);

const StyledSlider = styled.div<
  Pick<SliderProps, 'numberOfVisibleSlides' | 'endOfVisibleSlidePosition'>
>((props) => {
  // This logic is to remove transition animation on browser resize
  const prevNumberOfVisibleSlides = usePrevious(props.numberOfVisibleSlides);

  let hasNumberOfVisibleSlidesChanged =
    prevNumberOfVisibleSlides !== 0 &&
    prevNumberOfVisibleSlides !== undefined &&
    prevNumberOfVisibleSlides !== props.numberOfVisibleSlides;

  const hasNumberOfVisibleSlidesChangedRef = useRef(false);

  if (hasNumberOfVisibleSlidesChangedRef.current) {
    hasNumberOfVisibleSlidesChanged = true;
    hasNumberOfVisibleSlidesChangedRef.current = false;
  } else if (hasNumberOfVisibleSlidesChanged) {
    hasNumberOfVisibleSlidesChangedRef.current = true;
  }

  return {
    display: 'flex',
    transform: `translateX(${
      -1 *
      getSlideWidthInPercentages(props.numberOfVisibleSlides) *
      (props.endOfVisibleSlidePosition - props.numberOfVisibleSlides)
    }%)`,
    ...(!hasNumberOfVisibleSlidesChanged && { transition: 'transform 0.5s' }),
    width: '100%',
  };
});

const Slider: React.ForwardRefRenderFunction<HTMLDivElement, SliderProps> = (
  {
    leftArrowWidth,
    rightArrowWidth,
    endOfVisibleSlidePosition,
    numberOfVisibleSlides,
    children,
  },
  ref,
) => (
  <SliderWrapper
    leftArrowWidth={leftArrowWidth}
    rightArrowWidth={rightArrowWidth}
    ref={ref}
  >
    <StyledSlider
      numberOfVisibleSlides={numberOfVisibleSlides}
      endOfVisibleSlidePosition={endOfVisibleSlidePosition}
    >
      {children}
    </StyledSlider>
  </SliderWrapper>
);

export default forwardRef(Slider);
