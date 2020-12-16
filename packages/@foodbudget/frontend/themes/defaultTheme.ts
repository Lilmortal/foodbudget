import typography, { Typography } from '../styles/typography';
import * as colorPalette from '../styles/colorPalette';
import spacing, { Spacing } from '../styles/spacing';

export interface ColorTheme {
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
}

export interface Theme {
  colors: ColorTheme;
  typography: Typography;
  spacing: Spacing;
}

const colors: ColorTheme = {
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
  secondaryButtonText: colorPalette.tulipTree,
  secondaryButtonBorder: colorPalette.tulipTree,
  secondaryButtonDisabledFill: colorPalette.white,
  secondaryButtonDisabledText: colorPalette.hitGray,
  secondaryButtonDisabledBorder: colorPalette.hitGray,
  secondaryButtonHoverFill: colorPalette.tulipTree,
  secondaryButtonHoverText: colorPalette.white,
  secondaryButtonHoverBorder: colorPalette.tulipTree,
};

const defaultTheme: Theme = {
  colors,
  typography,
  spacing,
};

export default defaultTheme;
