import React from 'react';

import { render, RenderResult } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import EscapePress, { EscapePressProps } from './useEscapePress';

const onEscapePress = jest.fn();

const defaultProps: EscapePressProps = { onEscapePress };

const renderEscapePress = (props?: Partial<EscapePressProps>): RenderResult =>
  render(<EscapePress {...defaultProps} {...props} />);

describe('escape press', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should trigger onEscapePress on escape press', () => {
    renderEscapePress();

    userEvent.type(window, '{esc}');

    expect(onEscapePress).toBeCalled();
  });
});
