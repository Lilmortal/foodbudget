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
  
    ${lg`
    font-size: 1.8rem;
  `}
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

  ${sm(`
    font-size: ${typography.mobXlFont};
  `)}
}

h2 {
  font-size: ${typography.lgFont};
  font-weight: ${typography.mdWeight};

  ${sm(`
    font-size: ${typography.mobLgFont};
  `)}
}

h3 {
  font-size: ${typography.mdFont};
  font-weight: ${typography.smWeight};

  ${sm(`
    font-size: ${typography.mobMdFont};
  `)}
}

h4 {
  font-size: ${typography.smFont};
  font-weight: ${typography.smWeight};

  ${sm(`
    font-size: ${typography.mobSmFont};
  `)}
}

h5 {
  font-size: ${typography.smFont};
  font-weight: ${typography.xlWeight};

  ${sm(`
    font-size: ${typography.mobSmFont};
  `)}
}

body {
  font-family: 'Amiko', sans-serif;
  font-size: ${typography.xsFont};
  font-weight: ${typography.xsWeight};

  ${sm(`
    font-weight: ${typography.mobXsFont};
  `)}

  ${print(`
    font-size: ${typography.xxsFont};
    font-weight: ${typography.xxsWeight};
  `)}
}
`;

const GlobalTheme = createGlobalStyle`
  ${spacing}
  ${theme}
  `;

export default GlobalTheme;
