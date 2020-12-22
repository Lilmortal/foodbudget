import styled from 'styled-components';

export type TextfieldProps = React.InputHTMLAttributes<HTMLInputElement>;

const Textfield = styled.input<TextfieldProps>((props) => ({
  borderRadius: '5px',
  border: `1px solid ${props.theme.colors.primaryBorder}`,
  padding: '1.5rem',
  maxWidth: '400px',
  width: '100%',
  fontSize: 'inherit',
}));

export default Textfield;
