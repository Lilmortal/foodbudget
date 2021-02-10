import Button from 'components/Button';
import { mockBreakpoint } from 'matchMediaMock';
import { render, RenderResult, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Carousel, { CarouselProps } from './Carousel';
import { Breakpoints } from './useCarouselBreakpoints';

const breakpoints: Breakpoints = {
  xl: {
    minWidthInPixels: 1200,
    numberOfVisibleSlides: 4,
    numberOfSlidesPerSwipe: 4,
  },
  lg: {
    minWidthInPixels: 600,
    numberOfVisibleSlides: 3,
    numberOfSlidesPerSwipe: 3,
  },
  md: {
    minWidthInPixels: 0,
    numberOfVisibleSlides: 2,
    numberOfSlidesPerSwipe: 2,
  },
};

const defaultProps: CarouselProps = {
  breakpoints,
  children: [
    <Button>1</Button>,
    <Button>2</Button>,
    <Button>3</Button>,
    <Button>4</Button>,
    <Button>5</Button>,
    <Button>6</Button>,
    <Button>7</Button>,
    <Button>8</Button>,
    <Button>9</Button>,
  ],
  loadMore: jest.fn(),
  hasMore: true,
};

const mockLgBreakpoint = () =>
  mockBreakpoint('screen and (min-width: 600px) and (max-width: 1199px)');

const mockMdBreakpoint = () =>
  mockBreakpoint('screen and (min-width: 0px) and (max-width: 599px)');

const renderCarousel = (props?: Partial<CarouselProps>): RenderResult =>
  render(<Carousel {...defaultProps} {...props} />);

describe('carousel', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('transition', () => {
    it('should move 2 slides to the right when the right arrow is clicked on md breakpoint', () => {
      mockMdBreakpoint();

      renderCarousel();

      expect(screen.getByRole('button', { name: '4' }).tabIndex).toEqual(-1);

      const rightArrow = screen.getByRole('button', {
        name: '>',
      });

      userEvent.click(rightArrow);

      expect(screen.getByRole('button', { name: '4' }).tabIndex).toEqual(0);
      expect(screen.getByRole('button', { name: '5' }).tabIndex).toEqual(-1);
    });

    it('should move 3 slides to the right when the right arrow is clicked on lg breakpoint', () => {
      mockLgBreakpoint();

      renderCarousel();

      expect(screen.getByRole('button', { name: '6' }).tabIndex).toEqual(-1);

      const rightArrow = screen.getByRole('button', {
        name: '>',
      });

      userEvent.click(rightArrow);

      expect(screen.getByRole('button', { name: '6' }).tabIndex).toEqual(0);
      expect(screen.getByRole('button', { name: '7' }).tabIndex).toEqual(-1);
    });

    it(
      'should move 2 slides to the left when the left arrow is clicked on md breakpoint ' +
        'after right arrow has been clicked',
      () => {
        mockLgBreakpoint();

        renderCarousel();

        expect(
          screen.getByRole('button', { name: '1' }).tabIndex,
        ).not.toBeNull();

        const leftArrow = screen.getByRole('button', {
          name: '<',
        });

        const rightArrow = screen.getByRole('button', {
          name: '>',
        });

        userEvent.click(rightArrow);

        expect(screen.getByRole('button', { name: '1' }).tabIndex).toEqual(-1);

        userEvent.click(leftArrow);

        expect(
          screen.getByRole('button', { name: '1' }).tabIndex,
        ).not.toBeNull();
      },
    );
  });

  describe('load more', () => {
    it('should trigger loadMore when reached to the end of the carousel', () => {
      mockLgBreakpoint();

      renderCarousel();

      const rightArrow = screen.getByRole('button', {
        name: '>',
      });

      userEvent.click(rightArrow);

      expect(defaultProps.loadMore).not.toHaveBeenCalled();

      userEvent.click(rightArrow);

      expect(defaultProps.loadMore).toHaveBeenCalled();
    });

    it('should not trigger loadMore when hasMore is false and reached to the end of the carousel', () => {
      mockLgBreakpoint();

      renderCarousel({ hasMore: false });

      const rightArrow = screen.getByRole('button', {
        name: '>',
      });

      userEvent.click(rightArrow);

      expect(defaultProps.loadMore).not.toHaveBeenCalled();
    });
  });

  describe('disabled buttons', () => {
    it('should not disable left arrow when it can be swiped left', () => {
      mockLgBreakpoint();

      renderCarousel();

      const leftArrow = screen.getByRole('button', {
        name: '<',
      });

      const rightArrow = screen.getByRole('button', {
        name: '>',
      });

      userEvent.click(rightArrow);

      expect(leftArrow).not.toBeDisabled();
    });

    it('should disable left arrow when it cannot be swiped left', () => {
      mockLgBreakpoint();

      renderCarousel();

      const leftArrow = screen.getByRole('button', {
        name: '<',
      });

      expect(leftArrow).toBeDisabled();
    });

    it('should not disable right arrow when it can be swiped right', () => {
      mockLgBreakpoint();

      renderCarousel();

      const rightArrow = screen.getByRole('button', {
        name: '>',
      });

      expect(rightArrow).not.toBeDisabled();
    });

    it('should disable right arrow when it cannot be swiped right', () => {
      mockLgBreakpoint();

      renderCarousel({ hasMore: false });

      const rightArrow = screen.getByRole('button', {
        name: '>',
      });

      userEvent.click(rightArrow);
      expect(rightArrow).not.toBeDisabled();

      userEvent.click(rightArrow);
      expect(rightArrow).toBeDisabled();
    });

    it('should not disable right arrow when it can load more slides', () => {
      mockLgBreakpoint();

      renderCarousel();

      const rightArrow = screen.getByRole('button', {
        name: '>',
      });

      userEvent.click(rightArrow);

      expect(rightArrow).not.toBeDisabled();
    });
  });

  describe('focus', () => {
    it('should move focus to the first visible slide when right arrow is pressed via a keyboard', () => {
      mockLgBreakpoint();

      renderCarousel();

      const rightArrow = screen.getByRole('button', {
        name: '>',
      });

      // TODO: Bug, for some reason this triggers the onClick twice.
      userEvent.type(rightArrow, '{enter}');

      expect(screen.getByRole('button', { name: '7' })).toHaveFocus();
    });

    it('should move focus to the last visible slide when left arrow is pressed via a keyboard', () => {
      mockLgBreakpoint();

      renderCarousel();

      const rightArrow = screen.getByRole('button', {
        name: '>',
      });

      userEvent.type(rightArrow, '{enter}');

      const leftArrow = screen.getByRole('button', {
        name: '<',
      });

      userEvent.type(leftArrow, '{enter}');

      expect(screen.getByRole('button', { name: '3' })).toHaveFocus();
    });
  });
});
