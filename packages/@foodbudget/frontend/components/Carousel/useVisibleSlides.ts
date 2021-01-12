import { useState, useEffect } from 'react';

export interface Breakpoint {
  minWidthInPixels: number;
  numberOfVisibleSlides: number;
}

export interface Responsives {
  [key: string]: Breakpoint;
}

const sortMaxWidthToLowest = (
  { minWidthInPixels: first }: Breakpoint,
  { minWidthInPixels: second }: Breakpoint,
) => first - second;

const useVisibleSlides = <R extends Responsives>(breakpoints: R): number => {
  const [numberOfVisibleSlides, setNumberOfVisibleSlides] = useState(0);

  useEffect(() => {
    Object.values(breakpoints)
      .sort(sortMaxWidthToLowest)
      .forEach((value, index, arr) => {
        const listener = (evt: MediaQueryListEvent) => {
          if (evt.matches) {
            setNumberOfVisibleSlides(value.numberOfVisibleSlides);
          }
        };

        let query = `screen and (min-width: ${value.minWidthInPixels}px)`;

        if (arr.length !== index + 1) {
          query += ` and (max-width: ${arr[index + 1].minWidthInPixels - 1}px)`;
        }

        const queries = window.matchMedia(query);

        if (queries.matches) {
          setNumberOfVisibleSlides(value.numberOfVisibleSlides);
        }

        queries.addEventListener('change', listener);

        return () => queries.removeEventListener('change', listener);
      });
  }, [breakpoints]);

  return numberOfVisibleSlides;
};

export default useVisibleSlides;
