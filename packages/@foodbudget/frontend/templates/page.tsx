import styled from 'styled-components';
import Button from '../components/Button';
import Logo from '../components/Logo';

const Header = styled.header({
  display: 'flex',
});

const PageBody = styled.div({
  display: 'flex',
});

const PageTemplate: React.FC<{}> = ({ children }) => (
  <PageBody>
    <Header>
      <Logo src="Logo.png" />
      <Button variant="secondary">LOGIN/SIGNUP</Button>
    </Header>
    {children}
  </PageBody>
);

export default PageTemplate;
