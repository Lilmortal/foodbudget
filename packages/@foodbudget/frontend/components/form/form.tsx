import { ErrorMessage as FormErrorMessage, ErrorMessageProps } from 'formik';
import styled from 'styled-components';

const ErrorMessageWrapper = styled.div({
  color: 'red',
  display: 'flex',
  padding: '0.6rem 0 0 0',
});

const ErrorMessage: React.FC<ErrorMessageProps> = (props) => (
  <ErrorMessageWrapper>
    <FormErrorMessage {...props} />
  </ErrorMessageWrapper>
);

export * from 'formik';
export { ErrorMessage };
