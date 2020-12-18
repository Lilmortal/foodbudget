import React from 'react';
import { ThemeProvider } from 'styled-components';
import theme from '../themes/defaultTheme';
import GlobalTheme, { FontFaces } from '../styles/globalStyle';

export const decorators = [
  (Story) => (
    <ThemeProvider theme={theme}>
      <GlobalTheme />
      <FontFaces />
      <Story />
    </ThemeProvider>
  ),
];
