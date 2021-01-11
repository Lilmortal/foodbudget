import React from 'react';
import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import ImagePanel from 'components/ImagePanel';
import Carousel from './Carousel';

const items = [
  <ImagePanel src="pizza.webp" style={{ backgroundColor: 'red' }} />,
  <ImagePanel src="pizza.webp" style={{ backgroundColor: 'blue' }} />,
  <ImagePanel src="pizza.webp" style={{ backgroundColor: 'yellow' }} />,
  <ImagePanel src="pizza.webp" style={{ backgroundColor: 'green' }} />,
  <ImagePanel src="pizza.webp" style={{ backgroundColor: 'purple' }} />,
];

storiesOf('Carousel', module).add('default', () => (
  <Carousel items={items} hasMore={true} loadMore={action('loadMore')} />
));