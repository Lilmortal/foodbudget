import React, { useEffect, useRef, useState } from 'react';
import noScroll from 'no-scroll';
import { createPortal } from 'react-dom';
import classnames from 'classnames';
import EscapePress from 'components/EscapePress';
import Overlay from './Overlay';
import CloseButton from './CloseButton';
import FocusTrap from './FocusTrap';

import styles from './Modal.module.scss';

export interface ModalProps extends Styleable {
  open?: boolean;
  selector?: string;
  onOutsideAction?(): void;
  onEscapePress?(): void;
  onClose?(): void;
  children?: React.ReactNode;
  overlayDataTestId?: string;
}

const Modal: React.FC<ModalProps> = ({
  open,
  selector = '#modal',
  onClose,
  onOutsideAction,
  onEscapePress,
  overlayDataTestId,
  className,
  style,
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

  return mounted && portalRef.current
    ? createPortal(
        <FocusTrap>
          <Overlay
            onOutsideAction={onOutsideAction}
            dataTestId={overlayDataTestId}
          />
          <div className={classnames(styles.modal, className)} style={style}>
            {onEscapePress && <EscapePress onEscapePress={onEscapePress} />}
            {onClose && <CloseButton onClose={onClose} />}
            {children}
          </div>
        </FocusTrap>,
        portalRef.current,
      )
    : null;
};

export default Modal;
