const breakpointXs = '32em';
const breakpointSm = '36em';
const breakpointMd = '76.8em';
const breakpointLg = '102.4em';
const breakpointXl = '144em';

const print = `@media only print`;

const xs = `@media only screen and (min-width: ${breakpointXs})`;

const sm = `@media only screen and (min-width: ${breakpointSm})`;

const md = `@media only screen and (min-width: ${breakpointMd})`;

const lg = `@media only screen and (min-width: ${breakpointLg})`;

const xl = `@media only screen and (min-width: ${breakpointXl})`;
export interface Breakpoints {
  print: string;
  xs: string;
  sm: string;
  md: string;
  lg: string;
  xl: string;
}

const breakpoints: Breakpoints = {
  print,
  xs,
  sm,
  md,
  lg,
  xl,
};

export default breakpoints;
