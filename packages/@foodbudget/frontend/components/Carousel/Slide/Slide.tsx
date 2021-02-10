import { useEffect, forwardRef } from 'react';
import classnames from 'classnames';

import styles from './Slide.module.scss';

export interface SlideProps extends React.HTMLAttributes<HTMLDivElement> {
  onUnmount?(activeElement: React.ReactNode): void;
}

const Slide: React.ForwardRefRenderFunction<HTMLDivElement, SlideProps> = (
  props,
  ref,
) => {
  const { onUnmount, className, style, ...otherProps } = props;

  useEffect(() => {
    if (onUnmount) {
      return () => onUnmount(document.activeElement);
    }
    return undefined;
  }, [onUnmount]);

  return (
    <div
      className={classnames(styles.slideWrapper, className)}
      style={style}
      {...otherProps}
      ref={ref}
    />
  );
};

export default forwardRef(Slide);
