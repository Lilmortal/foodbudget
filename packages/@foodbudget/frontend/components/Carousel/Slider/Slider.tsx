import { forwardRef } from 'react';
import styled from 'styled-components';

export interface SliderProps {
  leftArrowWidth: number;
  rightArrowWidth: number;
  numberOfVisibleSlides: number;
  position: number;
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

const getSlideWidthPercentage = (numberOfVisibleSlides: number) =>
  Math.round(100 / numberOfVisibleSlides);

const StyledSlider = styled.div<
  Pick<SliderProps, 'numberOfVisibleSlides' | 'position'>
>((props) => ({
  display: 'flex',
  ...(props.position && {
    transform: `translateX(${
      -1 * getSlideWidthPercentage(props.numberOfVisibleSlides) * props.position
    }%)`,
  }),
  transition: 'transform 0.5s',
  width: '100%',
}));

const Slider: React.ForwardRefRenderFunction<HTMLDivElement, SliderProps> = (
  {
    leftArrowWidth,
    rightArrowWidth,
    position,
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
      position={position}
    >
      {children}
    </StyledSlider>
  </SliderWrapper>
);

export default forwardRef(Slider);
