import styled from 'styled-components';

export interface TextfieldProps {
  type?: string;
}

const Textfield = styled.input<TextfieldProps>((props) => ({
  borderRadius: '19px',
  border: `1px solid ${props.theme.colors.primaryBorder}`,
  padding: '1rem',
  maxWidth: '400px',
  width: '100%',
}));

export default Textfield;
