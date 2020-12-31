import styled from 'styled-components';

export interface LogoProps {
  src: string;
  className?: string;
}
const StyledLogo = styled.img({
  maxWidth: '460px',
  maxHeight: '60px',
});

const Logo: React.FC<LogoProps> = ({ src, className }) => (
  <StyledLogo src={src} className={className} />
);

export default Logo;
