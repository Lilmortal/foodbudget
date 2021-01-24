import Button from 'components/Button';
import Logo from 'components/Logo';
import Modal, { ModalProps } from 'components/Modal';
import classnames from 'classnames';

import styles from './AuthModal.module.scss';

export type AuthModalProps = Omit<ModalProps, 'selector'>;

const AuthModal: React.FC<AuthModalProps> = (props) => {
  const { className, style, ...otherProps } = props;

  return (
    <Modal
      className={classnames(styles.modal, className)}
      style={style}
      selector="#modal"
      {...otherProps}
    >
      <div className={styles.modalWrapper}>
        <Logo src="logo.svg" />

        <div className={styles.buttonGroup}>
          <Button>Connect with Facebook</Button>
          <Button>Connect with Google</Button>
        </div>
      </div>
    </Modal>
  );
};

export default AuthModal;
