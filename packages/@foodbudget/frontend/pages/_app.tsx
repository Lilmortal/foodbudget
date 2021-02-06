import { AppProps } from 'next/app';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { ApolloProvider } from '@apollo/client';
import { useApolloClient } from '../src/lib/client';

import '../styles/index.scss';
import '../themes/defaultTheme.scss';
import './styles.scss';

const App: React.FC<AppProps> = ({ Component, pageProps }) => {
  const client = useApolloClient(pageProps.initialApolloState);

  return (
    <ApolloProvider client={client}>
      <DndProvider backend={HTML5Backend}>
        <Component {...pageProps} />
      </DndProvider>
    </ApolloProvider>
  );
};

export default App;
