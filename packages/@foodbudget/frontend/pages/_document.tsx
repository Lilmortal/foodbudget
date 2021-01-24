import { RenderPageResult } from 'next/dist/next-server/lib/utils';
import Document, {
  Head,
  Main,
  NextScript,
  Html,
  DocumentContext,
} from 'next/document';
import { ServerStyleSheet } from 'styled-components';

// TODO: Add og:title and twitter in the future
const PreloadedFonts: React.FC<{}> = () => (
  <>
    <link
      ref="preload"
      as="font"
      href="/fonts/Amiko/Amiko-Regular.woff2"
      type="font/woff2"
      crossOrigin="anonymous"
    />
    <link
      ref="preload"
      as="font"
      href="/fonts/ABeeZee/ABeeZee-Regular.woff2"
      type="font/woff2"
      crossOrigin="anonymous"
    />
  </>
);

const Favicons: React.FC<{}> = () => (
  <>
    <link
      rel="icon"
      type="image/png"
      sizes="16x16"
      href="/favicons/favicon-16x16.png"
    />
    <link
      rel="icon"
      type="image/png"
      sizes="32x32"
      href="/favicons/favicon-32x32.png"
    />
    <link
      rel="icon"
      type="image/png"
      sizes="48x48"
      href="/favicons/favicon-48x48.png"
    />
    <link
      rel="icon"
      type="image/png"
      sizes="150x150"
      href="/favicons/mstile-150x150.png"
    />
    <link
      rel="icon"
      type="image/png"
      sizes="192x192"
      href="/favicons/android-chrome-192x192.png"
    />
    <link
      rel="icon"
      type="image/png"
      sizes="384x384"
      href="/favicons/android-chrome-384x384.png"
    />
    <link
      rel="apple-touch-icon"
      sizes="120x120"
      href="/favicons/apple-touch-icon.png"
    />
    <link
      rel="mask-icon"
      href="/favicons/safari-pinned-tab.svg"
      color="#5bbad5"
    />
    <link rel="manifest" href="/favicons/site.webmanifest" />
    <meta name="msapplication-config" content="/favicons/browserconfig.xml" />
  </>
);

export default class MyDocument extends Document {
  static async getInitialProps(
    ctx: DocumentContext,
  ): Promise<RenderPageResult> {
    // TODO: Come back to this to verify it works
    const sheet = new ServerStyleSheet();

    // Step 2: Retrieve styles from components in the page
    const page = ctx.renderPage((App) => (props) =>
      sheet.collectStyles(<App {...props} />),
    );

    // Step 3: Extract the styles as <style> tags
    const styleTags = sheet.getStyleElement();

    const result = { ...page, styleTags };

    return result;
  }

  // eslint-disable-next-line class-methods-use-this
  render(): React.ReactElement {
    return (
      // TODO: lang en for now, figure out how to use IntlProvider here
      <Html lang="en">
        <Head>
          <PreloadedFonts />
          <Favicons />
        </Head>
        <body>
          <Main />
          <NextScript />
          <div id="modal" />
        </body>
      </Html>
    );
  }
}
