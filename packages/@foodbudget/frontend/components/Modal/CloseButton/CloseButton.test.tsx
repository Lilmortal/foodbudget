import React from 'react';

import { render, RenderResult } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
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
    const { queryByText } = renderCloseButton();

    expect(queryByText('X')).toBeInTheDocument();
  });

  it('should trigger onClose on click', () => {
    const { queryByText } = renderCloseButton();

    queryByText('X')?.click();

    expect(onClose).toBeCalled();
  });

  it('should trigger onClose on enter press', () => {
    const { getByText } = renderCloseButton();

    userEvent.type(getByText('X'), '{enter}');

    expect(onClose).toBeCalled();
  });
});
