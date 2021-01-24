import React, { useCallback } from 'react';
import classnames from 'classnames';

import styles from './CloseButton.module.scss';

export interface CloseButtonProps extends Styleable {
  onClose(): void;
}

const CloseButton: React.FC<CloseButtonProps> = ({
  onClose,
  className,
  style,
}) => {
  const handleKeyPress = useCallback(
    (event: React.KeyboardEvent<HTMLDivElement>) =>
      event.key === 'Enter' && onClose(),
    [onClose],
  );

  return (
    <div
      className={classnames(styles.closeButton, className)}
      style={style}
      onClick={onClose}
      onKeyUp={handleKeyPress}
      tabIndex={0}
      aria-label="Close modal"
    >
      X
    </div>
  );
};

export default CloseButton;
