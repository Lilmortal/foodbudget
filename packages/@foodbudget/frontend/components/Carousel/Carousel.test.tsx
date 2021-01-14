import { render, RenderResult, screen, userEvent } from 'test-utils';
import Carousel, { CarouselProps } from './Carousel';

const defaultProps: CarouselProps = {};

const renderCarousel = (props?: Partial<CarouselProps>): RenderResult =>
  render(<Carousel {...defaultProps} {...props} />);

describe('carousel', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });
});
