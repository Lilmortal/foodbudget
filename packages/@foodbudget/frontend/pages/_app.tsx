import { AppProps } from 'next/app';
import { RelayEnvironmentProvider } from 'relay-hooks';
import { initEnvironment } from '../src/lib/environment';

const App: React.FC<AppProps> = ({ Component, pageProps }) => (
  <RelayEnvironmentProvider environment={initEnvironment(pageProps.data)}>
    <Component {...pageProps} />
  </RelayEnvironmentProvider>
);

export default App;
