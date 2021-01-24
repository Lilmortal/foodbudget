import classnames from 'classnames';

import styles from './Overlay.module.scss';

export interface OverlayProps extends Styleable {
  onOutsideAction?(): void;
  dataTestId?: string;
  children?: React.ReactNode;
}

const Overlay: React.FC<OverlayProps> = ({
  children,
  dataTestId,
  onOutsideAction,
  className,
  style,
}) => (
  <>
    <div
      className={classnames(styles.overlay, className)}
      style={style}
      data-testid={dataTestId}
      onClick={(): void => onOutsideAction && onOutsideAction()}
    />

    {children}
  </>
);

export default Overlay;
