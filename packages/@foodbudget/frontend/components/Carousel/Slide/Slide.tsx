import styled from 'styled-components';
import { useEffect, forwardRef } from 'react';

const StyledSlide = styled.div({
  paddingRight: '1rem',
  flexGrow: 1,
  flexBasis: 0,
});

export interface SlideProps extends React.HTMLAttributes<HTMLDivElement> {
  onUnmount?(activeElement: React.ReactNode): void;
}

const Slide: React.ForwardRefRenderFunction<HTMLDivElement, SlideProps> = (
  props,
  ref,
) => {
  const { onUnmount, ...otherProps } = props;

  useEffect(() => {
    if (onUnmount) {
      return () => onUnmount(document.activeElement);
    }
    return undefined;
  }, [onUnmount]);

  return <StyledSlide {...otherProps} ref={ref} />;
};

export default forwardRef(Slide);
