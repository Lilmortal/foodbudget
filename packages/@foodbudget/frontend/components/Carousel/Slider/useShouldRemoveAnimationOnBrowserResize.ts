import usePrevious from 'components/usePrevious';
import { useRef } from 'react';

const useShouldRemoveAnimationOnBrowserResize = (
  numberOfVisibleSlides: number,
): boolean => {
  const prevNumberOfVisibleSlides = usePrevious(numberOfVisibleSlides);

  let hasNumberOfVisibleSlidesChanged =
    prevNumberOfVisibleSlides !== 0 &&
    prevNumberOfVisibleSlides !== undefined &&
    prevNumberOfVisibleSlides !== numberOfVisibleSlides;

  const hasNumberOfVisibleSlidesChangedRef = useRef(false);

  if (hasNumberOfVisibleSlidesChangedRef.current) {
    hasNumberOfVisibleSlidesChanged = true;
    hasNumberOfVisibleSlidesChangedRef.current = false;
  } else if (hasNumberOfVisibleSlidesChanged) {
    hasNumberOfVisibleSlidesChangedRef.current = true;
  }

  return hasNumberOfVisibleSlidesChangedRef.current;
};

export default useShouldRemoveAnimationOnBrowserResize;
