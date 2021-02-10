import classnames from 'classnames';

import styles from './Header.module.scss';

export type HeaderProps = Styleable;

const Header: React.FC<HeaderProps> = ({ className, style, children }) => (
  <header className={classnames(styles.header, className)} style={style}>
    {children}
  </header>
);

export default Header;
