import { useState, useEffect } from 'react';

export interface Breakpoint {
  minWidthInPixels: number;
  numberOfVisibleSlides: number;
  numberOfSlidesPerSwipe?: number;
}

export interface Breakpoints {
  [key: string]: Breakpoint;
}

const sortMaxWidthToLowest = (
  [, { minWidthInPixels: first }]: [string, Breakpoint],
  [, { minWidthInPixels: second }]: [string, Breakpoint],
) => first - second;

export interface CarouselBreakpoints {
  breakpointName: string;
  numberOfVisibleSlides: number;
  numberOfSlidesPerSwipe: number;
}

const useCarouselBreakpoints = <B extends Breakpoints>(
  breakpoints: B,
): CarouselBreakpoints => {
  const [breakpointName, setBreakpointName] = useState('');
  const [numberOfVisibleSlides, setNumberOfVisibleSlides] = useState(0);
  const [numberOfSlidesPerSwipe, setNumberOfSlidesPerSwipe] = useState(0);

  useEffect(() => {
    const sortedBreakpoints = Object.entries(breakpoints).sort(
      sortMaxWidthToLowest,
    );

    sortedBreakpoints.forEach(([name, breakpoint], index) => {
      const listener = (evt: MediaQueryListEvent) => {
        if (evt.matches) {
          setNumberOfVisibleSlides(breakpoint.numberOfVisibleSlides);
          setBreakpointName(name);
        }
      };

      let query = `screen and (min-width: ${breakpoint.minWidthInPixels}px)`;

      if (Object.values(breakpoints).length !== index + 1) {
        query += ` and (max-width: ${
          Object.values(sortedBreakpoints)[index + 1][1].minWidthInPixels - 1
        }px)`;
      }

      const queries = window.matchMedia(query);

      if (queries.matches) {
        setNumberOfVisibleSlides(breakpoint.numberOfVisibleSlides);
        setBreakpointName(name);
        setNumberOfSlidesPerSwipe(breakpoint.numberOfSlidesPerSwipe ?? 1);
      }

      queries.addEventListener('change', listener);

      return () => queries.removeEventListener('change', listener);
    });
  }, [breakpoints]);

  return { breakpointName, numberOfVisibleSlides, numberOfSlidesPerSwipe };
};

export default useCarouselBreakpoints;
