import { forwardRef } from 'react';
import styled from 'styled-components';

export interface SliderProps {
  leftArrowWidth: number;
  rightArrowWidth: number;
  numberOfSlidesPerSwipe: number;
  slideWidth: number;
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

const StyledSlider = styled.div<
  Pick<SliderProps, 'numberOfSlidesPerSwipe' | 'slideWidth'>
>((props) => ({
  display: 'flex',
  transform: `translateX(${
    -1 * props.numberOfSlidesPerSwipe * props.slideWidth
  }px)`,
  transition: 'transform 0.5s',
}));

const Slider: React.ForwardRefRenderFunction<HTMLDivElement, SliderProps> = (
  {
    leftArrowWidth,
    rightArrowWidth,
    numberOfSlidesPerSwipe,
    slideWidth,
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
      numberOfSlidesPerSwipe={numberOfSlidesPerSwipe}
      slideWidth={slideWidth}
    >
      {children}
    </StyledSlider>
  </SliderWrapper>
);

export default forwardRef(Slider);
