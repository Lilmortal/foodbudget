import Button from 'components/Button';
import { mockBreakpoint } from 'matchMediaMock';
import { render, RenderResult, screen, userEvent } from 'test-utils';
import Carousel, { CarouselProps } from './Carousel';
import { Breakpoints } from './useCarouselBreakpoints';

const breakpoints: Breakpoints = {
  xl: { minWidthInPixels: 1200, numberOfVisibleSlides: 4 },
  lg: { minWidthInPixels: 600, numberOfVisibleSlides: 3 },
  md: { minWidthInPixels: 0, numberOfVisibleSlides: 2 },
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

      renderCarousel({ numberOfSlidesPerSwipe: 2 });

      expect(screen.queryByRole('button', { name: '4' })).toBeNull();

      const rightArrow = screen.getByRole('button', {
        name: '>',
      });

      userEvent.click(rightArrow);

      expect(screen.queryByRole('button', { name: '4' })).not.toBeNull();
      expect(screen.queryByRole('button', { name: '5' })).toBeNull();
    });

    it('should move 3 slides to the right when the right arrow is clicked on lg breakpoint', () => {
      mockLgBreakpoint();

      renderCarousel({ numberOfSlidesPerSwipe: 2 });

      expect(screen.queryByRole('button', { name: '5' })).toBeNull();

      const rightArrow = screen.getByRole('button', {
        name: '>',
      });

      userEvent.click(rightArrow);

      expect(screen.queryByRole('button', { name: '5' })).not.toBeNull();
      expect(screen.queryByRole('button', { name: '6' })).toBeNull();
    });

    it(
      'should move 2 slides to the left when the left arrow is clicked on md breakpoint ' +
        'after right arrow has been clicked',
      () => {
        mockLgBreakpoint();

        renderCarousel({ numberOfSlidesPerSwipe: 2 });

        expect(screen.queryByRole('button', { name: '1' })).not.toBeNull();

        const leftArrow = screen.getByRole('button', {
          name: '<',
        });

        const rightArrow = screen.getByRole('button', {
          name: '>',
        });

        userEvent.click(rightArrow);

        expect(screen.queryByRole('button', { name: '1' })).toBeNull();

        userEvent.click(leftArrow);

        expect(screen.queryByRole('button', { name: '1' })).not.toBeNull();
      },
    );
  });

  describe('load more', () => {
    it('should trigger loadMore when reached to the end of the carousel', () => {
      mockLgBreakpoint();

      renderCarousel({ numberOfSlidesPerSwipe: 2 });

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

      renderCarousel({ numberOfSlidesPerSwipe: 3, hasMore: false });

      const rightArrow = screen.getByRole('button', {
        name: '>',
      });

      userEvent.click(rightArrow);

      expect(defaultProps.loadMore).not.toHaveBeenCalled();
    });
  });

  describe('arrows visibility on breakpoints', () => {
    it('should not remove arrows on md breakpoint', () => {
      mockLgBreakpoint();

      renderCarousel();

      expect(screen.queryByRole('button', { name: '<' })).not.toBeNull();
      expect(screen.queryByRole('button', { name: '>' })).not.toBeNull();
    });

    it('should remove arrows on md breakpoint when removeArrowsOnDeviceType is specified', () => {
      mockLgBreakpoint();

      renderCarousel({ removeArrowsOnDeviceType: ['lg'] });

      expect(screen.queryByRole('button', { name: '<' })).toBeNull();
      expect(screen.queryByRole('button', { name: '>' })).toBeNull();
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

      renderCarousel({ numberOfSlidesPerSwipe: 3, hasMore: false });

      const rightArrow = screen.getByRole('button', {
        name: '>',
      });

      userEvent.click(rightArrow);

      expect(rightArrow).toBeDisabled();
    });

    it('should not disable right arrow when it can load more slides', () => {
      mockLgBreakpoint();

      renderCarousel({ numberOfSlidesPerSwipe: 3 });

      const rightArrow = screen.getByRole('button', {
        name: '>',
      });

      userEvent.click(rightArrow);

      expect(rightArrow).not.toBeDisabled();
    });
  });
});
