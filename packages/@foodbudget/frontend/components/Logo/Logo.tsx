import classnames from 'classnames';

import styles from './Logo.module.scss';

export interface LogoProps extends Styleable {
  src: string;
  className?: string;
}

const Logo: React.FC<LogoProps> = ({ src, className, style }) => (
  <img className={classnames(styles.logo, className)} style={style} src={src} />
);

export default Logo;
