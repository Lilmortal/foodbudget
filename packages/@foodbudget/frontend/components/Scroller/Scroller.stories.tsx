import React from 'react';
import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import ImagePanel from 'components/ImagePanel';
import styled from 'styled-components';
import { v4 } from 'uuid';
import Scroller from './Scroller';

const Item = styled.div({
  padding: '1rem',
});

const itemList = [
  <ImagePanel src="pizza.webp" />,
  <ImagePanel src="pizza.webp" />,
  <ImagePanel src="pizza.webp" />,
  <ImagePanel src="pizza.webp" />,
  <ImagePanel src="pizza.webp" />,
];

const ItemList = itemList.map((item) => <Item key={v4()}>{item}</Item>);

storiesOf('scroller', module).add('default', () => (
  <Scroller onLoad={action('onLoad')} itemList={ItemList} hasMore={false} />
));
