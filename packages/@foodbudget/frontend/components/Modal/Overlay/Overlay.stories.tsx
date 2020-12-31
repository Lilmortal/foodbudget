import React from 'react';
import { storiesOf } from '@storybook/react';

import { action } from '@storybook/addon-actions';
import Overlay, { OverlayProps } from './Overlay';

const defaultProps: OverlayProps = {
  onOutsideAction: action('onOutsideAction'),
};

const RenderedOverlay: React.FC<Partial<OverlayProps>> = ({ ...props }) => (
  <>
    <div>Outside overlay</div>
    <Overlay {...defaultProps} {...props} />
  </>
);

storiesOf('Overlay', module).add('default', () => <RenderedOverlay />);
