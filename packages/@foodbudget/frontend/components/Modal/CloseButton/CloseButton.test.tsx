import React from 'react';

import { screen, render, RenderResult, userEvent } from 'test-utils';
import CloseButton, { CloseButtonProps } from './CloseButton';

const onClose = jest.fn();

const defaultProps: CloseButtonProps = { onClose };

const renderCloseButton = (props?: Partial<CloseButtonProps>): RenderResult =>
  render(<CloseButton {...defaultProps} {...props} />);

describe('close button', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should render close button', () => {
    renderCloseButton();

    expect(screen.getByText('X')).toBeInTheDocument();
  });

  it('should trigger onClose on click', () => {
    renderCloseButton();

    userEvent.click(screen.getByText('X'));

    expect(onClose).toBeCalled();
  });

  it('should trigger onClose on enter press', () => {
    renderCloseButton();

    userEvent.type(screen.getByText('X'), '{enter}');

    expect(onClose).toBeCalled();
  });
});
