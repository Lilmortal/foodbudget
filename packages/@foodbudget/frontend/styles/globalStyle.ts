import { createGlobalStyle, css } from 'styled-components';
import { lg, sm, print } from './breakpoints';
import typography from './typography';

const spacing = css`
  html {
    font-size: 62.5%;
  }

  body {
    font-size: 1.6rem;
    line-height: 2.6rem;

    ${lg({
      fontSize: '1.8rem',
    })}
  }
`;

const theme = css`
  *,
  *::before,
  *::after {
    box-sizing: border-box;
  }

  h1 {
    font-size: ${typography.xlFont};
    font-weight: ${typography.lgWeight};

    ${sm({
      fontSize: typography.mobXlFont,
    })}
  }

  h2 {
    font-size: ${typography.lgFont};
    font-weight: ${typography.mdWeight};

    ${sm({
      fontSize: typography.mobLgFont,
    })}
  }

  h3 {
    font-size: ${typography.mdFont};
    font-weight: ${typography.smWeight};

    ${sm({
      fontSize: typography.mobMdFont,
    })}
  }

  h4 {
    font-size: ${typography.smFont};
    font-weight: ${typography.smWeight};

    ${sm({
      fontSize: typography.mobSmFont,
    })}
  }

  h5 {
    font-size: ${typography.smFont};
    font-weight: ${typography.xlWeight};

    ${sm({
      fontSize: typography.mobSmFont,
    })}
  }

  body {
    font-family: 'Amiko', sans-serif;
    font-size: ${typography.xsFont};
    font-weight: ${typography.xsWeight};

    ${sm({
      fontWeight: typography.xsWeight,
    })}

    ${print({
      fontSize: typography.xxsFont,
      fontWeight: typography.xxsWeight,
    })}
  }
`;

const GlobalTheme = createGlobalStyle`
  ${spacing}
  ${theme}
  `;

export default GlobalTheme;
