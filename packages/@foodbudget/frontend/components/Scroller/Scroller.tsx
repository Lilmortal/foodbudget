import { useState } from 'react';
import Button from 'components/Button';
import styled from 'styled-components';

import Carousel from 'react-multi-carousel';
import 'react-multi-carousel/lib/styles.css';

const Arrow = styled(Button)({
  position: 'absolute',
  zIndex: 2,
});

const LeftArrow = (props: React.ButtonHTMLAttributes<HTMLButtonElement>) => (
  <Arrow {...props}>{'<'}</Arrow>
);

const RightArrow = (props: React.ButtonHTMLAttributes<HTMLButtonElement>) => (
  <Arrow {...props} style={{ right: 0 }}>
    {'>'}
  </Arrow>
);

export interface ScrollerProps {
  horizontal?: boolean;
  onLoad(): void;
  draggable?: boolean;
  itemList: React.ReactNode[];
  cutOffPoint?: number;
  hasMore: boolean;
  renderLeftArrow?: React.ReactElement;
  renderRightArrow?: React.ReactElement;
  onDrag?(): void;
}

const responsive = {
  xl: {
    breakpoint: { max: 4000, min: 3000 },
    items: 5,
  },
  lg: {
    breakpoint: { max: 3000, min: 1024 },
    items: 3,
  },
  md: {
    breakpoint: { max: 1024, min: 464 },
    items: 2,
  },
  sm: {
    breakpoint: { max: 464, min: 0 },
    items: 1,
  },
};

// TODO:
// Disable onClick when moving
// Disable tab when not in view
const Scroller: React.FC<ScrollerProps> = ({
  onLoad,
  itemList,
  hasMore,
  renderLeftArrow = <LeftArrow />,
  renderRightArrow = <RightArrow />,
}) => {
  const [isMoving, setIsMoving] = useState(false);

  const handleOnClick = (event: any) => {
    if (isMoving) {
      event.preventDefault();
    }
  };

  return (
    <Carousel
      responsive={responsive}
      ssr={true}
      removeArrowOnDeviceType={['sm', 'md']}
      customLeftArrow={renderLeftArrow}
      customRightArrow={renderRightArrow}
      beforeChange={() => setIsMoving(true)}
      afterChange={() => setIsMoving(false)}
      slidesToSlide={2}
    >
      {itemList}
      {hasMore && <div onClick={onLoad}>Load more...</div>}
    </Carousel>
  );
};

export default Scroller;
