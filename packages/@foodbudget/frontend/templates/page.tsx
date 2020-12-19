import styled from 'styled-components';
import Button from '../components/Button';
import Logo from '../components/Logo';

const Header = styled.header({
  display: 'flex',
  justifyContent: 'space-between',
  padding: '2rem 3rem',
});

const PageBody = styled.div({
  display: 'flex',
  flexDirection: 'column',
  flexGrow: 1,
  backgroundImage: "url('background.jpg')",
  backgroundRepeat: 'no-repeat',
  backgroundSize: 'cover',
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
  <PageBody>
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
    <Wrapper>{children}</Wrapper>
  </PageBody>
);

export default PageTemplate;
