import { createGlobalStyle } from 'styled-components';
import breakpoints from './breakpoints';
import typography from './typography';

const GlobalTheme = createGlobalStyle({
  '*': {
    boxSizing: 'border-box',
    margin: 0,
    padding: 0,
    border: 0,
  },
  '*:before': {
    boxSizing: 'border-box',
    margin: 0,
    padding: 0,
    border: 0,
  },
  '*:after': {
    boxSizing: 'border-box',
    margin: 0,
    padding: 0,
    border: 0,
  },

  html: {
    fontSize: '62.5%',
  },

  h1: {
    fontSize: typography.xlFont,
    fontWeight: typography.lgWeight,

    [breakpoints.sm]: {
      fontSize: typography.mobXlFont,
    },
  },

  h2: {
    fontSize: typography.lgFont,
    fontWeight: typography.mdWeight,

    [breakpoints.sm]: {
      fontSize: typography.mobLgFont,
    },
  },

  h3: {
    fontSize: typography.mdFont,
    fontWeight: typography.smWeight,

    [breakpoints.sm]: {
      fontSize: typography.mobMdFont,
    },
  },

  h4: {
    fontSize: typography.smFont,
    fontWeight: typography.smWeight,

    [breakpoints.sm]: {
      fontSize: typography.mobSmFont,
    },
  },

  h5: {
    fontSize: typography.smFont,
    fontWeight: typography.xlWeight,

    [breakpoints.sm]: {
      fontSize: typography.mobSmFont,
    },
  },

  body: {
    fontDamily: `'Amiko', sans-serif`,
    fontSize: typography.xsFont,
    fontWeight: typography.xsWeight,
    minHeight: '100vh',
    display: 'flex',
    flexDirection: 'column',
    lineHeight: '2.6rem',

    [breakpoints.lg]: {
      fontSize: typography.smFont,
    },

    [breakpoints.sm]: {
      fontWeight: typography.xsWeight,
    },

    [breakpoints.print]: {
      fontSize: typography.xxsFont,
      fontWeight: typography.xxsWeight,
    },
  },

  '#__next': {
    display: 'flex',
    flexDirection: 'column',
    flexGrow: 1,
  },
});

export default GlobalTheme;
