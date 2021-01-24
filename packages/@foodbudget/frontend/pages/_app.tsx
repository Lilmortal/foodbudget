import { AppProps } from 'next/app';
import { ApolloProvider } from '@apollo/client';
import { useApolloClient } from '../src/lib/client';

import '../styles/index.scss';
import '../themes/defaultTheme.scss';
import './styles.scss';

const App: React.FC<AppProps> = ({ Component, pageProps }) => {
  const client = useApolloClient(pageProps.initialApolloState);

  return (
    <ApolloProvider client={client}>
      <Component {...pageProps} />
    </ApolloProvider>
  );
};

export default App;
