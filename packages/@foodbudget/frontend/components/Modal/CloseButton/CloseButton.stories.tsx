import React from 'react';
import { storiesOf } from '@storybook/react';

import { action } from '@storybook/addon-actions';
import CloseButton, { CloseButtonProps } from './CloseButton';

const defaultProps: CloseButtonProps = {
  onClose: action('onClose'),
};

const RenderedCloseButton: React.FC<Partial<CloseButtonProps>> = ({
  ...props
}) => (
  <div style={{ backgroundColor: 'black', height: '100vh' }}>
    <CloseButton {...defaultProps} {...props} />
  </div>
);

storiesOf('CloseButton', module).add('default', () => <RenderedCloseButton />);
