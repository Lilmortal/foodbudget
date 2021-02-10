import classnames from 'classnames';
import styles from './Button.module.scss';

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary';
  inverse?: boolean;
  showCloseIcon?: boolean;
}

const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  inverse,
  showCloseIcon,
  className,
  style,
  ...props
}) => {
  const buttonClassNames = [styles.button];
  if (variant === 'primary' && inverse) {
    buttonClassNames.push(styles['button--inverse']);
  }

  if (variant === 'secondary') {
    if (inverse) {
      buttonClassNames.push(styles['button__secondary--inverse']);
    } else {
      buttonClassNames.push(styles.button__secondary);
    }
  }

  if (showCloseIcon) {
    buttonClassNames.push(styles['button--showCloseIcon']);
  }

  return (
    <button
      className={classnames(buttonClassNames, className)}
      style={style}
      {...props}
    />
  );
};

export default Button;
