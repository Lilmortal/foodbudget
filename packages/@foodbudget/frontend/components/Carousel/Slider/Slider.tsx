import { forwardRef } from 'react';
import styled from 'styled-components';

export interface SliderProps {
  leftArrowWidth: number;
  rightArrowWidth: number;
  position: number;
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

const StyledSlider = styled.div<Pick<SliderProps, 'position' | 'slideWidth'>>(
  (props) => ({
    display: 'flex',
    transform: `translateX(${-1 * props.position * props.slideWidth}px)`,
    transition: 'transform 0.5s',
  }),
);

const Slider: React.ForwardRefRenderFunction<HTMLDivElement, SliderProps> = (
  { leftArrowWidth, rightArrowWidth, slideWidth, position, children },
  ref,
) => (
  <SliderWrapper
    leftArrowWidth={leftArrowWidth}
    rightArrowWidth={rightArrowWidth}
    ref={ref}
  >
    <StyledSlider position={position} slideWidth={slideWidth}>
      {children}
    </StyledSlider>
  </SliderWrapper>
);

export default forwardRef(Slider);
