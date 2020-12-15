import styled from 'styled-components';

export interface ButtonProps {
  variant?: 'default' | 'primary';
  active?: boolean;
}

const Button = styled.button<ButtonProps>`
  background-color: ${(props) => props.theme.colors.primaryButtonFill};
  border: 1px solid transparent;
  border-radius: 19px;
  color: ${(props) => props.theme.colors.primaryButtonText};
  cursor: pointer;
  font: inherit;
  font-weight: ${(props) => props.theme.typography.xxlWeight};
  line-height: 1;
  padding: 1rem 2.5rem;

  ${(props) =>
    !props.active
    && `background-color: ${props.theme.colors.secondaryButtonFill};`
}
`;

Button.defaultProps = {
  variant: 'default',
  active: true,
};

export default Button;
