import styled from 'styled-components';

export interface OverlayProps {
  onOutsideAction?(): void;
  dataTestId?: string;
  children?: React.ReactNode;
}

const StyledOverlay = styled.div({
  position: 'fixed',
  top: '0',
  left: '0',
  right: '0',
  bottom: '0',
  backgroundColor: 'rgba(0, 0, 0, 0.5)',
  zIndex: 1000,
  width: '100%',
  height: '100%',
});

const Overlay: React.FC<OverlayProps> = ({
  children,
  dataTestId,
  onOutsideAction,
}) => (
  <>
    <StyledOverlay
      data-testid={dataTestId}
      onClick={(): void => onOutsideAction && onOutsideAction()}
    />

    {children}
  </>
);

export default Overlay;
