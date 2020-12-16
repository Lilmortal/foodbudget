import styled from 'styled-components';
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
    </Header>
    {children}
  </PageBody>
);

export default PageTemplate;
