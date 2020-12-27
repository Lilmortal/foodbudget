import React from 'react';
import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import Button from './Button';

storiesOf('button', module)
  .add('primary variant', () => <Button variant="primary">Button</Button>)
  .add('secondary variant', () => <Button variant="secondary">Button</Button>)
  .add('primary inverse variant', () => <Button inverse>Button</Button>)
  .add('secondary inverse variant', () => (
    <Button variant="secondary" inverse>
      Button
    </Button>
  ))
  .add('has close icon', () => (
    <Button showCloseIcon onClick={action('onClick')}>
      Button
    </Button>
  ))
  .add('on click enabled', () => (
    <Button onClick={action('onClick')}>Button</Button>
  ));
