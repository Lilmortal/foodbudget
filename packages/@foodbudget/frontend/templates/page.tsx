import styled from 'styled-components';
import Logo from '../components/Logo';

const PageBody = styled.div({
  display: 'flex',
});

const PageTemplate: React.FC<{}> = ({ children }) => <PageBody><Logo />{children}</PageBody>;

export default PageTemplate;
