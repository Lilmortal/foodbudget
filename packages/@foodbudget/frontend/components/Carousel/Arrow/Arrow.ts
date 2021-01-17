import Button from 'components/Button';
import styled from 'styled-components';

export const Arrow = styled(Button)({
  position: 'absolute',
  zIndex: 2,
});

export const ArrowWrapper = styled.div({
  position: 'absolute',
  display: 'flex',
  alignItems: 'center',
  height: '100%',
});
