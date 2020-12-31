import React, { useCallback } from 'react';
import styled from 'styled-components';

export interface CloseButtonProps {
  onClose(): void;
}

const StyledCloseButton = styled.div(({ theme }) => ({
  position: 'fixed',
  marginTop: '3rem',
  display: 'flex',
  right: '14%',
  fontSize: '2rem',
  cursor: 'pointer',
  mixBlendMode: 'difference',
  color: 'white',
  zIndex: 1000,

  [theme.breakpoints.lg]: {
    right: '7%',
  },
}));

const CloseButton: React.FC<CloseButtonProps> = ({ onClose }) => {
  const handleKeyPress = useCallback(
    (event: React.KeyboardEvent<HTMLDivElement>) =>
      event.key === 'Enter' && onClose(),
    [onClose],
  );

  return (
    <StyledCloseButton
      onClick={onClose}
      onKeyUp={handleKeyPress}
      tabIndex={0}
      aria-label="Close modal"
    >
      X
    </StyledCloseButton>
  );
};

export default CloseButton;
