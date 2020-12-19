import typography, { Typography } from '../styles/typography';
import * as colorPalette from '../styles/colorPalette';
import spacing, { Spacing } from '../styles/spacing';
import breakpoints, { Breakpoints } from '../styles/breakpoints';

export interface ColorTheme {
  primaryFill: string;
  primaryBorder: string;
  secondaryText: string;
  primaryButtonFill: string;
  primaryButtonText: string;
  primaryButtonBorder: string;
  primaryButtonDisabledFill: string;
  primaryButtonDisabledText: string;
  primaryButtonDisabledBorder: string;
  primaryButtonHoverFill: string;
  primaryButtonHoverText: string;
  primaryButtonHoverBorder: string;
  secondaryButtonFill: string;
  secondaryButtonText: string;
  secondaryButtonBorder: string;
  secondaryButtonDisabledFill: string;
  secondaryButtonDisabledText: string;
  secondaryButtonDisabledBorder: string;
  secondaryButtonHoverFill: string;
  secondaryButtonHoverText: string;
  secondaryButtonHoverBorder: string;
  white: string;
  black: string;
}

export interface Theme {
  colors: ColorTheme;
  typography: Typography;
  spacing: Spacing;
  breakpoints: Breakpoints;
}

const colors: ColorTheme = {
  primaryFill: colorPalette.blueChill,
  primaryBorder: colorPalette.blueChill,
  secondaryText: colorPalette.limedSpruce,
  primaryButtonFill: colorPalette.blueChill,
  primaryButtonText: colorPalette.white,
  primaryButtonBorder: colorPalette.blueChill,
  primaryButtonDisabledFill: colorPalette.hitGray,
  primaryButtonDisabledText: colorPalette.white,
  primaryButtonDisabledBorder: colorPalette.hitGray,
  primaryButtonHoverFill: colorPalette.white,
  primaryButtonHoverText: colorPalette.blueChill,
  primaryButtonHoverBorder: colorPalette.blueChill,
  secondaryButtonFill: colorPalette.white,
  secondaryButtonText: colorPalette.black,
  secondaryButtonBorder: colorPalette.tulipTree,
  secondaryButtonDisabledFill: colorPalette.white,
  secondaryButtonDisabledText: colorPalette.hitGray,
  secondaryButtonDisabledBorder: colorPalette.hitGray,
  secondaryButtonHoverFill: colorPalette.tulipTree,
  secondaryButtonHoverText: colorPalette.white,
  secondaryButtonHoverBorder: colorPalette.tulipTree,
  white: colorPalette.white,
  black: colorPalette.black,
};

const defaultTheme: Theme = {
  colors,
  typography,
  spacing,
  breakpoints,
};

export default defaultTheme;
