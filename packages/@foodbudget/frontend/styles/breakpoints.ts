import { css, FlattenSimpleInterpolation, SimpleInterpolation } from 'styled-components';

const breakpointXs = '32rem';
const breakpointSm = '36rem';
const breakpointMd = '76.8rem';
const breakpointLg = '102.4rem';
const breakpointXl = '144rem';

export const print = (content: SimpleInterpolation): FlattenSimpleInterpolation => css`
  @media only print {
    ${content}
  }
`;

export const xs = (content: SimpleInterpolation): FlattenSimpleInterpolation => css`
  @media only screen and (min-width: ${breakpointXs}) {
    ${content}
  }
`;

export const sm = (content: SimpleInterpolation): FlattenSimpleInterpolation => css`
  @media only screen and (min-width: ${breakpointSm}) {
    ${content}
  }
`;

export const md = (content: SimpleInterpolation): FlattenSimpleInterpolation => css`
  @media only screen and (min-width: ${breakpointMd}) {
    ${content}
  }
`;

export const lg = (content: SimpleInterpolation): FlattenSimpleInterpolation => css`
  @media only screen and (min-width: ${breakpointLg}) {
    ${content}
  }
`;

export const xl = (content: SimpleInterpolation): FlattenSimpleInterpolation => css`
  @media only screen and (min-width: ${breakpointXl}) {
    ${content}
  }
`;
