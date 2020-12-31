import Button from 'components/Button';
import Logo from 'components/Logo';
import Modal, { ModalProps } from 'components/Modal';
import styled from 'styled-components';

export type AuthModalProps = Omit<ModalProps, 'selector'>;

const ModalWrapper = styled.div({
  display: 'flex',
  flexDirection: 'column',
  width: '100%',
  height: '100%',
  alignItems: 'center',
});

const StyledModal = styled(Modal)({
  top: '20rem',
  bottom: '20rem',
});

const ModalLogo = styled(Logo)({
  margin: '2rem',
});

const ButtonGroup = styled.div({
  display: 'flex',
  flexDirection: 'column',
  flexGrow: 1,
  justifyContent: 'center',
});

const AuthModal: React.FC<AuthModalProps> = (props) => (
  <StyledModal {...props} selector="#modal">
    <ModalWrapper>
      <ModalLogo src="logo.svg" />

      <ButtonGroup>
        <Button>Connect with Facebook</Button>
        <Button>Connect with Google</Button>
      </ButtonGroup>
    </ModalWrapper>
  </StyledModal>
);

export default AuthModal;
