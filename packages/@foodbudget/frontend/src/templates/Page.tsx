import { useState } from 'react';
import styled, { createGlobalStyle } from 'styled-components';
import Button from '../../components/Button';
import Logo from '../../components/Logo';
import AuthModal from './AuthModal';

const Header = styled.header({
  display: 'flex',
  justifyContent: 'space-between',
  padding: '2rem 3rem',
});

const Body = createGlobalStyle({
  body: {
    backgroundImage: "url('background.webp')",
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

const PageTemplate: React.FC<{}> = ({ children }) => {
  const [authModalOpen, setAuthModalOpen] = useState(false);

  const handleOnClose = () => setAuthModalOpen(false);

  return (
    <>
      <Header>
        <Logo src="logo.svg" />
        <ButtonWrapper>
          <Button
            variant="secondary"
            inverse
            style={{ fontFamily: "'ABeeZee', sans-serif" }}
            onClick={() => setAuthModalOpen(true)}
          >
            LOGIN / SIGNUP
          </Button>
        </ButtonWrapper>
      </Header>
      <Body />
      <AuthModal
        open={authModalOpen}
        onClose={handleOnClose}
        onEscapePress={handleOnClose}
        onOutsideAction={handleOnClose}
      />
      <Wrapper>{children}</Wrapper>
    </>
  );
};

export default PageTemplate;
