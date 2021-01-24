import Button from 'components/Button';
import Logo from 'components/Logo';
import { useState } from 'react';
import classnames from 'classnames';
import Header from 'components/Header';
import Link from 'next/link';
import AuthModal from './AuthModal';

import styles from './MainPage.module.scss';

export type PageTemplateProps = Styleable;

const MainPage: React.FC<PageTemplateProps> = ({
  className,
  style,
  children,
}) => {
  const [authModalOpen, setAuthModalOpen] = useState(false);

  const handleOnClose = () => setAuthModalOpen(false);

  return (
    <div
      className={classnames(styles.mainPageWrapper, className)}
      style={style}
    >
      <Header className={styles.header}>
        <Link href="/">
          <a>
            <Logo src="logo.svg" />
          </a>
        </Link>
        <div className={styles.buttonWrapper}>
          <Button
            variant="secondary"
            inverse
            style={{ fontFamily: "'ABeeZee', sans-serif" }}
            onClick={() => setAuthModalOpen(true)}
          >
            LOGIN / SIGNUP
          </Button>
        </div>
      </Header>
      <AuthModal
        open={authModalOpen}
        onClose={handleOnClose}
        onEscapePress={handleOnClose}
        onOutsideAction={handleOnClose}
      />
      <div className={styles.bodyWrapper}>{children}</div>
    </div>
  );
};

export default MainPage;
