import React from 'react';
import { storiesOf } from '@storybook/react';

import { action } from '@storybook/addon-actions';
import EscapePress, { EscapePressProps } from './EscapePress';

const defaultProps: EscapePressProps = {
  onEscapePress: action('onEscapePress'),
};

const RenderedEscapePress: React.FC<Partial<EscapePressProps>> = ({
  ...props
}) => <EscapePress {...defaultProps} {...props} />;

storiesOf('EscapePress', module).add('default', () => (
  <div>
    <span>Press Esc to trigger an action</span>
    <RenderedEscapePress />
  </div>
));
