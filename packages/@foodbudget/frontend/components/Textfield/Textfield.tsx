import classnames from 'classnames';

import styles from './Textfield.module.scss';

export type TextfieldProps = React.InputHTMLAttributes<HTMLInputElement>;

const Textfield: React.FC<TextfieldProps> = ({ className, ...props }) => (
  <input className={classnames(styles.textfield, className)} {...props} />
);

export default Textfield;
