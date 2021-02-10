import React from 'react';

import { screen, render, RenderResult } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Overlay, { OverlayProps } from './Overlay';

const onOutsideAction = jest.fn();

const defaultProps: OverlayProps = { onOutsideAction };

const renderOverlay = (props?: Partial<OverlayProps>): RenderResult =>
  render(<Overlay {...defaultProps} {...props} />);

describe('escape press', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should trigger onOutsideAction on click', () => {
    renderOverlay({ dataTestId: 'overlay' });

    userEvent.click(screen.getByTestId('overlay'));
    expect(onOutsideAction).toBeCalled();
  });
});
