import styled from 'styled-components';
import { ArrowWrapper } from './Arrow';

export const LeftArrowWrapper = styled(ArrowWrapper)({
  left: 0,
});

export const RightArrowWrapper = styled(ArrowWrapper)({
  right: 0,
});

interface CarouselWrapperProps {
  horizontal?: boolean;
}

export const CarouselWrapper = styled.div<CarouselWrapperProps>((props) => ({
  display: 'flex',
  flexDirection: props.horizontal ? 'row' : 'column',
  position: 'relative',
}));

export const SlideWrapper = styled.div({
  display: 'flex',
  minWidth: '100%',
});
