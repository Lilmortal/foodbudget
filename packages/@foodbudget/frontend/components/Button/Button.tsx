import classnames from 'classnames';
import styles from './Button.module.scss';

export interface ButtonProps {
    variant?: 'default' | 'primary';
}

const Button: React.FC<ButtonProps> = ({ variant = 'default', children }) => (
    <button className={classnames(styles.button, { [styles['button-primary']]: variant === 'primary' })}>{children}</button>
);

export default Button;
