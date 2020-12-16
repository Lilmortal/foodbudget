import styled from 'styled-components';

export interface LogoProps {
  src: string;
}
const StyledLogo = styled.img({
  maxWidth: '460px',
  maxHeight: '60px',
});

const Logo: React.FC<LogoProps> = ({ src }) => <StyledLogo src={src} />;

export default Logo;
