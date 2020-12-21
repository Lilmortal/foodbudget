import styled, { createGlobalStyle } from 'styled-components';
import Button from '../../components/Button';
import Logo from '../../components/Logo';

const Header = styled.header({
  display: 'flex',
  justifyContent: 'space-between',
  padding: '2rem 3rem',
});

const Body = createGlobalStyle({
  body: {
    backgroundImage: "url('background.jpg')",
    backgroundRepeat: 'no-repeat',
    backgroundSize: 'cover',
  },
});

const Wrapper = styled.div({
  display: 'flex',
  flexDirection: 'column',
  flexGrow: 1,
});

const ButtonWrapper = styled.div({
  display: 'flex',
});

const PageTemplate: React.FC<{}> = ({ children }) => (
  <>
    <Header>
      <Logo src="logo.svg" />
      <ButtonWrapper>
        <Button
          variant="secondary"
          inverse
          style={{ fontFamily: "'ABeeZee', sans-serif" }}
        >
          LOGIN / SIGNUP
        </Button>
      </ButtonWrapper>
    </Header>
    <Body />
    <Wrapper>{children}</Wrapper>
  </>
);

export default PageTemplate;
