import typography, { Typography } from '../styles/typography';
import * as colorPalette from '../styles/colorPalette';

export interface ColorTheme {
  primaryButtonFill: string;
  primaryButtonText: string;
  primaryButtonDisabled: string;
  secondaryButtonFill: string;
}

export interface FoodBudgetTheme {
  colors: ColorTheme;
  typography: Typography;
}

const colors: ColorTheme = {
  primaryButtonFill: colorPalette.blueChill,
  primaryButtonText: colorPalette.white,
  primaryButtonDisabled: colorPalette.hitGray,
  secondaryButtonFill: colorPalette.tulipTree,
};

const defaultTheme: FoodBudgetTheme = {
  colors,
  typography,
};

export default defaultTheme;
