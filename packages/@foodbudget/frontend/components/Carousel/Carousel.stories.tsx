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

const breakpoints = {
  xl: { minWidthInPixels: 1200, numberOfVisibleSlides: 4 },
  lg: { minWidthInPixels: 600, numberOfVisibleSlides: 3 },
  md: { minWidthInPixels: 0, numberOfVisibleSlides: 2 },
};

storiesOf('Carousel', module).add('default', () => (
  <Carousel
    hasMore={true}
    loadMore={action('loadMore')}
    breakpoints={breakpoints}
  >
    {items}
  </Carousel>
));
