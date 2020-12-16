import { AppProps } from 'next/app';
import { ApolloProvider } from '@apollo/client';
import { ThemeProvider } from 'styled-components';
import { useApolloClient } from '../src/lib/client';
import GlobalTheme from '../styles/globalStyle';
import defaultTheme from '../themes/defaultTheme';

const App: React.FC<AppProps> = ({ Component, pageProps }) => {
  const client = useApolloClient(pageProps.initialApolloState);

  return (
    <ApolloProvider client={client}>
      <ThemeProvider theme={defaultTheme}>
        <GlobalTheme />
        <Component {...pageProps} />
      </ThemeProvider>
    </ApolloProvider>
  );
};

export default App;
