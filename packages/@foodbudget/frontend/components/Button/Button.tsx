import styled from 'styled-components';

export interface ButtonProps {
  variant?: 'default' | 'primary';
  active?: boolean;
}

const Button = styled.button<ButtonProps>((props) => ({
  backgroundColor: props.theme.colors.primaryButtonFill,
  border: '1px solid transparent',
  borderRadius: '19px',
  color: props.theme.colors.primaryButtonText,
  cursor: 'pointer',
  font: 'inherit',
  fontWeight: props.theme.typography.xxlWeight,
  lineHeight: '1',
  padding: '1rem 2.5rem',

  ...(!props.active && { backgroundColor: props.theme.colors.secondaryButtonFill }),
}));

Button.defaultProps = {
  variant: 'default',
  active: true,
};

export default Button;
