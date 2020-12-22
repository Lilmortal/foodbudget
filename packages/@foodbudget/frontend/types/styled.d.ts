import 'styled-components';
import { Theme } from '../themes/defaultTheme';

declare module 'styled-components' {
  // eslint-disable-next-line @typescript-eslint/no-empty-interface
  export interface DefaultTheme extends Theme {}
}
