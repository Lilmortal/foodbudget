import typography, { Typography } from '../styles/typography';
import * as colorPalette from '../styles/colorPalette';
import spacing, { Spacing } from '../styles/spacing';

export interface ColorTheme {
  primaryButtonFill: string;
  primaryButtonText: string;
  primaryButtonDisabled: string;
  secondaryButtonFill: string;
}

export interface Theme {
  colors: ColorTheme;
  typography: Typography;
  spacing: Spacing;
}

const colors: ColorTheme = {
  primaryButtonFill: colorPalette.blueChill,
  primaryButtonText: colorPalette.white,
  primaryButtonDisabled: colorPalette.hitGray,
  secondaryButtonFill: colorPalette.tulipTree,
};

const defaultTheme: Theme = {
  colors,
  typography,
  spacing,
};

export default defaultTheme;
