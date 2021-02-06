import { useState } from 'react';
import Carousel from 'components/Carousel';
import Modal from 'components/Modal';
import classnames from 'classnames';
import RecipeCard from './RecipeCard';

import styles from './RecipeModal.module.scss';

export interface RecipeModalProps extends Styleable {
  open?: boolean;
  onRecipeClick(source: string): void;
  onClose(): void;
}

const RecipeModal: React.FC<RecipeModalProps> = ({
  open = false,
  onRecipeClick,
  onClose,
  className,
  style,
}) => {
  const [items, setItems] = useState<React.ReactNode[]>([
    <RecipeCard
      onClick={onRecipeClick}
      source="https://picsum.photos/id/230/200/300"
    />,
    <RecipeCard
      onClick={onRecipeClick}
      source="https://picsum.photos/id/231/200/300"
    />,
    <RecipeCard
      onClick={onRecipeClick}
      source="https://picsum.photos/id/232/200/300"
    />,
    <RecipeCard
      onClick={onRecipeClick}
      source="https://picsum.photos/id/233/200/300"
    />,
    <RecipeCard
      onClick={onRecipeClick}
      source="https://picsum.photos/id/234/200/300"
    />,
  ]);

  const [hasMore, setHasMore] = useState(true);

  const loadMore = () => {
    setItems([
      ...items,
      <RecipeCard
        onClick={onRecipeClick}
        source="https://picsum.photos/id/235/200/300"
      />,
      <RecipeCard
        onClick={onRecipeClick}
        source="https://picsum.photos/id/236/200/300"
      />,
      <RecipeCard
        onClick={onRecipeClick}
        source="https://picsum.photos/id/237/200/300"
      />,
      <RecipeCard
        onClick={onRecipeClick}
        source="https://picsum.photos/id/238/200/300"
      />,
      <RecipeCard
        onClick={onRecipeClick}
        source="https://picsum.photos/id/239/200/300"
      />,
    ]);
    setHasMore(false);
  };

  return (
    <Modal open={open} onClose={onClose} onEscapePress={onClose}>
      <div className={classnames(styles.recipeModal, className)} style={style}>
        <h1>What recipe do you want?</h1>

        <div className={styles.recipeCarousel}>
          <p>Vegetarian</p>
          <Carousel
            hasMore={hasMore}
            loadMore={loadMore}
            breakpoints={{
              xl: {
                minWidthInPixels: 1200,
                numberOfVisibleSlides: 4,
                numberOfSlidesPerSwipe: 4,
              },
              lg: {
                minWidthInPixels: 600,
                numberOfVisibleSlides: 3,
                numberOfSlidesPerSwipe: 3,
              },
              md: {
                minWidthInPixels: 0,
                numberOfVisibleSlides: 2,
                numberOfSlidesPerSwipe: 2,
              },
            }}
            removeArrowsOnDeviceType={['md']}
          >
            {items}
          </Carousel>
        </div>

        <div className={styles.recipeCarousel}>
          <p>Vegetarian</p>
          <Carousel
            hasMore={hasMore}
            loadMore={loadMore}
            breakpoints={{
              xl: {
                minWidthInPixels: 1200,
                numberOfVisibleSlides: 4,
                numberOfSlidesPerSwipe: 4,
              },
              lg: {
                minWidthInPixels: 600,
                numberOfVisibleSlides: 3,
                numberOfSlidesPerSwipe: 3,
              },
              md: {
                minWidthInPixels: 0,
                numberOfVisibleSlides: 2,
                numberOfSlidesPerSwipe: 2,
              },
            }}
            removeArrowsOnDeviceType={['md']}
          >
            {items}
          </Carousel>
        </div>

        <div className={styles.recipeCarousel}>
          <p>Vegetarian</p>
          <Carousel
            hasMore={hasMore}
            loadMore={loadMore}
            breakpoints={{
              xl: {
                minWidthInPixels: 1200,
                numberOfVisibleSlides: 4,
                numberOfSlidesPerSwipe: 4,
              },
              lg: {
                minWidthInPixels: 600,
                numberOfVisibleSlides: 3,
                numberOfSlidesPerSwipe: 3,
              },
              md: {
                minWidthInPixels: 0,
                numberOfVisibleSlides: 2,
                numberOfSlidesPerSwipe: 2,
              },
            }}
            removeArrowsOnDeviceType={['md']}
          >
            {items}
          </Carousel>
        </div>

        <div className={styles.recipeCarousel}>
          <p>Vegetarian</p>
          <Carousel
            hasMore={hasMore}
            loadMore={loadMore}
            breakpoints={{
              xl: {
                minWidthInPixels: 1200,
                numberOfVisibleSlides: 4,
                numberOfSlidesPerSwipe: 4,
              },
              lg: {
                minWidthInPixels: 600,
                numberOfVisibleSlides: 3,
                numberOfSlidesPerSwipe: 3,
              },
              md: {
                minWidthInPixels: 0,
                numberOfVisibleSlides: 2,
                numberOfSlidesPerSwipe: 2,
              },
            }}
            removeArrowsOnDeviceType={['md']}
          >
            {items}
          </Carousel>
        </div>

        <div className={styles.recipeCarousel}>
          <p>Vegetarian</p>
          <Carousel
            hasMore={hasMore}
            loadMore={loadMore}
            breakpoints={{
              xl: {
                minWidthInPixels: 1200,
                numberOfVisibleSlides: 4,
                numberOfSlidesPerSwipe: 4,
              },
              lg: {
                minWidthInPixels: 600,
                numberOfVisibleSlides: 3,
                numberOfSlidesPerSwipe: 3,
              },
              md: {
                minWidthInPixels: 0,
                numberOfVisibleSlides: 2,
                numberOfSlidesPerSwipe: 2,
              },
            }}
            removeArrowsOnDeviceType={['md']}
          >
            {items}
          </Carousel>
        </div>
      </div>
    </Modal>
  );
};

export default RecipeModal;
