import { render, RenderResult, screen } from 'test-utils';
import userEvent from '@testing-library/user-event';
import Scroller, { ScrollerProps } from './Scroller';

const defaultProps: ScrollerProps = {};

const renderScroller = (props?: Partial<ScrollerProps>): RenderResult =>
  render(<Scroller {...defaultProps} {...props} />);

describe('scroller', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });
});
