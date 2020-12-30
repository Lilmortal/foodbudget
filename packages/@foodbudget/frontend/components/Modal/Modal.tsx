import React, { useEffect, useRef, useState } from 'react';
import noScroll from 'no-scroll';
import { createPortal } from 'react-dom';

import styled from 'styled-components';
import useEscapePress from 'components/useEscapePress';
import Overlay from './Overlay';
import CloseButton from './CloseButton';
import FocusTrap from './FocusTrap';

export interface ModalProps {
  open?: boolean;
  selector: string;
  onOutsideAction?(): void;
  onEscapePress?(): void;
  onClose?(): void;
  children?: React.ReactNode;
  overlayDataTestId?: string;
}

const StyledModal = styled.div(({ theme }) => ({
  position: 'fixed',
  top: '1rem',
  bottom: '1rem',
  left: '10%',
  right: '10%',
  backgroundColor: 'red',
  color: 'white',
  zIndex: 1000,
  overflowY: 'scroll',

  [theme.breakpoints.lg]: {
    left: '50%',
    transform: 'translateX(-50%)',
  },
}));

const Modal: React.FC<ModalProps> = ({
  open,
  selector,
  onClose,
  onOutsideAction,
  onEscapePress,
  overlayDataTestId,
  children,
}) => {
  const portalRef = useRef<Element | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    portalRef.current = document.querySelector(selector);
    setMounted(true);
  }, [selector]);

  useEffect(() => {
    if (open) {
      noScroll.on();
      (document.activeElement as HTMLElement)?.blur();
    } else {
      noScroll.off();
    }
    return (): void => noScroll.off();
  }, [open]);

  if (!open) {
    return null;
  }

  if (onEscapePress) {
    useEscapePress({ onEscapePress });
  }

  return mounted && portalRef.current
    ? createPortal(
        <FocusTrap>
          <Overlay
            onOutsideAction={onOutsideAction}
            dataTestId={overlayDataTestId}
          />
          <StyledModal>
            {onClose && <CloseButton onClose={onClose} />}
            {children}
          </StyledModal>
        </FocusTrap>,
        portalRef.current,
      )
    : null;
};

export default Modal;
