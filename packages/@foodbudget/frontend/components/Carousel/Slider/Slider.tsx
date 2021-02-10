import { forwardRef } from 'react';
import classnames from 'classnames';
import useShouldRemoveAnimationOnBrowserResize from './useShouldRemoveAnimationOnBrowserResize';

import styles from './Slider.module.scss';

export interface SliderProps extends Styleable {
  leftArrowWidth: number;
  rightArrowWidth: number;
  numberOfVisibleSlides: number;
  endOfVisibleSlidePosition: number;
  children: React.ReactNode[];
}

const getSlideWidthInPercentages = (numberOfVisibleSlides: number) =>
  Math.round(100 / numberOfVisibleSlides);

const Slider: React.ForwardRefRenderFunction<HTMLDivElement, SliderProps> = (
  {
    leftArrowWidth,
    rightArrowWidth,
    endOfVisibleSlidePosition,
    numberOfVisibleSlides,
    className,
    style,
    children,
  },
  ref,
) => {
  const shouldRemoveAnimation = useShouldRemoveAnimationOnBrowserResize(
    numberOfVisibleSlides,
  );

  const animationStyle = {
    transform: `translateX(${
      -1 *
      getSlideWidthInPercentages(numberOfVisibleSlides) *
      (endOfVisibleSlidePosition + 1 - numberOfVisibleSlides)
    }%)`,
    ...(!shouldRemoveAnimation && { transition: 'transform 0.5s' }),
  };

  return (
    <div
      ref={ref}
      className={classnames(styles.sliderWrapper, className)}
      style={{
        marginLeft: `${leftArrowWidth / 2}px`,
        marginRight: `${rightArrowWidth / 2}px`,

        ...style,
      }}
    >
      <div className={classnames(styles.slider)} style={animationStyle}>
        {children}
      </div>
    </div>
  );
};

export default forwardRef(Slider);
