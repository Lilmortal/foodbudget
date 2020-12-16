import styled from 'styled-components';

export interface ButtonProps {
  variant?: 'primary' | 'secondary';
  active?: boolean;
}

const Button = styled.button<ButtonProps>((props) => ({
  borderRadius: '19px',
  cursor: 'pointer',
  font: 'inherit',
  fontWeight: props.theme.typography.xxlWeight,
  lineHeight: '1',
  padding: '1rem 2.5rem',
  backgroundColor: props.theme.colors.primaryButtonFill,
  color: props.theme.colors.primaryButtonText,
  border: '1px solid transparent',

  ':hover': {
    backgroundColor: props.theme.colors.primaryButtonHoverFill,
    color: props.theme.colors.primaryButtonHoverText,
    borderColor: props.theme.colors.primaryButtonBorder,
  },

  ':disabled': {
    backgroundColor: props.theme.colors.primaryButtonDisabledFill,
    color: props.theme.colors.primaryButtonDisabledText,
    borderColor: props.theme.colors.primaryButtonDisabledBorder,
  },

  ...(props.variant === 'secondary' && {
    backgroundColor: props.theme.colors.secondaryButtonFill,
    color: props.theme.colors.secondaryButtonText,
    borderColor: props.theme.colors.secondaryButtonBorder,

    ':hover': {
      backgroundColor: props.theme.colors.secondaryButtonHoverFill,
      color: props.theme.colors.secondaryButtonHoverText,
      borderColor: props.theme.colors.secondaryButtonHoverBorder,
    },

    ':disabled': {
      backgroundColor: props.theme.colors.secondaryButtonDisabledFill,
      color: props.theme.colors.secondaryButtonDisabledText,
      borderColor: props.theme.colors.secondaryButtonDisabledBorder,
    },
  }),
}));

Button.defaultProps = {
  variant: 'primary',
  active: true,
};

export default Button;
