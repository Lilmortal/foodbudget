import styled from 'styled-components';

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary';
  inverse?: boolean;
  showCloseIcon?: boolean;
}

const StyledButton = styled.button<ButtonProps>((props) => ({
  borderRadius: '19px',
  height: 'fit-content',
  cursor: 'pointer',
  font: 'inherit',
  fontWeight: props.theme.typography.xxlWeight,
  lineHeight: '1',
  padding: '1rem 2.5rem',
  backgroundColor: props.inverse
    ? props.theme.colors.primaryButtonHoverFill
    : props.theme.colors.primaryButtonFill,
  color: props.inverse
    ? props.theme.colors.primaryButtonHoverText
    : props.theme.colors.primaryButtonText,
  border: `1px solid ${
    props.inverse ? props.theme.colors.primaryButtonBorder : 'transparent'
  }`,
  marginBottom: '1rem',

  ':hover': {
    backgroundColor: props.inverse
      ? props.theme.colors.primaryButtonFill
      : props.theme.colors.primaryButtonHoverFill,
    color: props.inverse
      ? props.theme.colors.primaryButtonText
      : props.theme.colors.primaryButtonHoverText,
    borderColor: props.inverse
      ? props.theme.colors.primaryButtonBorder
      : props.theme.colors.primaryButtonHoverBorder,
  },

  ':disabled': {
    backgroundColor: props.theme.colors.primaryButtonDisabledFill,
    color: props.theme.colors.primaryButtonDisabledText,
    borderColor: props.theme.colors.primaryButtonDisabledBorder,
    cursor: 'default',
  },

  ':enabled:active': {
    boxShadow:
      'inset 4px 4px 5px rgba(114, 58, 179, 0.1), inset -4px -4px 5px rgba(114, 58, 179, 0.1)',
  },

  ...(props.variant === 'secondary' && {
    backgroundColor: props.inverse
      ? props.theme.colors.secondaryButtonFill
      : props.theme.colors.secondaryButtonHoverFill,
    color: props.inverse
      ? props.theme.colors.secondaryButtonText
      : props.theme.colors.secondaryButtonHoverText,
    borderColor: props.inverse
      ? props.theme.colors.secondaryButtonBorder
      : props.theme.colors.secondaryButtonHoverBorder,

    ':hover': {
      backgroundColor: props.inverse
        ? props.theme.colors.secondaryButtonHoverFill
        : props.theme.colors.secondaryButtonFill,
      color: props.inverse
        ? props.theme.colors.secondaryButtonHoverText
        : props.theme.colors.secondaryButtonText,
      borderColor: props.inverse
        ? props.theme.colors.secondaryButtonHoverBorder
        : props.theme.colors.secondaryButtonBorder,
    },

    ':disabled': {
      backgroundColor: props.theme.colors.secondaryButtonDisabledFill,
      color: props.theme.colors.secondaryButtonDisabledText,
      borderColor: props.theme.colors.secondaryButtonDisabledBorder,
    },
  }),

  ...(props.showCloseIcon && {
    position: 'relative',
    pointerEvents: 'none',
    padding: '1rem 3.5rem 1rem 1rem',

    ':after': {
      content: `'X'`,
      fontSize: props.theme.typography.xxsFont,
      position: 'absolute',
      pointerEvents: 'all',
      right: '10px',
      bottom: '13px',
    },
  }),
}));

const Button: React.FC<ButtonProps> = ({ variant = 'primary', ...props }) => (
  <StyledButton variant={variant} {...props} />
);

export default Button;
