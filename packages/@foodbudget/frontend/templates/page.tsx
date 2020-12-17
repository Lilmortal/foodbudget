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
});

const Wrapper = styled.div({
  display: 'flex',
  flexDirection: 'column',
  flexGrow: 1,
});

const PageTemplate: React.FC<{}> = ({ children }) => (
  <PageBody>
    <Header>
      <Logo src="Logo.png" />
      <Button variant="secondary">LOGIN / SIGNUP</Button>
    </Header>
    <Wrapper>{children}</Wrapper>
  </PageBody>
);

export default PageTemplate;
