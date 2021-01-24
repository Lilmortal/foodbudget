import Button from 'components/Button';
import classnames from 'classnames';

import styles from './Arrow.module.scss';

export type ArrowProps = Styleable;

const Arrow: React.FC<ArrowProps> = ({
  children,
  className,
  style,
  ...props
}) => (
  <Button
    className={classnames(styles.arrow, className)}
    style={style}
    {...props}
  >
    {children}
  </Button>
);

export default Arrow;
