import {
  ErrorMessage as FormErrorMessage,
  ErrorMessageProps as FormErrorMessageProps,
} from 'formik';
import classnames from 'classnames';

import styles from './form.module.scss';

export interface ErrorMessageProps
  extends FormErrorMessageProps,
    Pick<Styleable, 'style'> {}

const ErrorMessage: React.FC<ErrorMessageProps> = (props) => {
  const { className, style, ...otherProps } = props;

  return (
    <div
      className={classnames(styles.errorMessageWrapper, className)}
      style={style}
    >
      <FormErrorMessage
        {...otherProps}
        className={styles.errorMessageWrapper}
      />
    </div>
  );
};

export * from 'formik';
export { ErrorMessage };
