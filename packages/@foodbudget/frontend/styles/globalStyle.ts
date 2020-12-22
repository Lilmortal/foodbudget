import { createGlobalStyle } from 'styled-components';

export const FontFaces = createGlobalStyle`
  @font-face {
    font-family: 'Amiko';
    font-display: swap;
    src: url('/fonts/Amiko/Amiko-Regular.woff2') format('woff2');
    font-weight: normal;
  }

  @font-face {
    font-family: 'ABeeZee';
    font-display: swap;
    src: url('/fonts/ABeeZee/ABeeZee-Regular.woff2') format('woff2');
    font-weight: normal;
  }
`;

const GlobalTheme = createGlobalStyle(({ theme }) => ({
  '*, *:before, *:after': {
    boxSizing: 'border-box',
    margin: 0,
    padding: 0,
    border: 0,
  },

  html: {
    fontSize: '62.5%',
  },

  h1: {
    fontSize: theme.typography.xlFont,
    fontWeight: theme.typography.lgWeight,

    [theme.breakpoints.sm]: {
      fontSize: theme.typography.mobXlFont,
    },
  },

  h2: {
    fontSize: theme.typography.lgFont,
    fontWeight: theme.typography.mdWeight,

    [theme.breakpoints.sm]: {
      fontSize: theme.typography.mobLgFont,
    },
  },

  h3: {
    fontSize: theme.typography.mdFont,
    fontWeight: theme.typography.smWeight,

    [theme.breakpoints.sm]: {
      fontSize: theme.typography.mobMdFont,
    },
  },

  h4: {
    fontSize: theme.typography.smFont,
    fontWeight: theme.typography.smWeight,

    [theme.breakpoints.sm]: {
      fontSize: theme.typography.mobSmFont,
    },
  },

  h5: {
    fontSize: theme.typography.smFont,
    fontWeight: theme.typography.xlWeight,

    [theme.breakpoints.sm]: {
      fontSize: theme.typography.mobSmFont,
    },
  },

  body: {
    fontFamily: `'Amiko', 'Arial', sans-serif`,
    fontSize: theme.typography.xsFont,
    fontWeight: theme.typography.xsWeight,
    minHeight: '100vh',
    display: 'flex',
    flexDirection: 'column',
    lineHeight: '2.6rem',

    [theme.breakpoints.lg]: {
      fontSize: theme.typography.smFont,
    },

    [theme.breakpoints.sm]: {
      fontWeight: theme.typography.xsWeight,
    },

    [theme.breakpoints.print]: {
      fontSize: theme.typography.xxsFont,
      fontWeight: theme.typography.xxsWeight,
    },
  },

  '#__next': {
    display: 'flex',
    flexDirection: 'column',
    flexGrow: 1,
  },
}));

export default GlobalTheme;
