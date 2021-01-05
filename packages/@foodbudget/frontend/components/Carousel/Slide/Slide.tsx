import styled from 'styled-components';

interface SlideProps {
  width: number;
  numberOfVisibleItems: number;
}

const Slide = styled.div<SlideProps>((props) => ({
  paddingRight: '1rem',
  minWidth: `${props.width}px`,
}));

export default Slide;
