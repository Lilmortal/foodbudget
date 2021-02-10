import Carousel from 'components/Carousel';
import Modal from 'components/Modal';
import classnames from 'classnames';

import styles from './RecipeModal.module.scss';

export interface RecipeModalProps extends Styleable {
  open?: boolean;
  items: React.ReactElement[];
  hasMore: boolean;
  loadMore(): void;
  onClose(): void;
}

const RecipeModal: React.FC<RecipeModalProps> = ({
  open = false,
  items,
  hasMore,
  loadMore,
  onClose,
  className,
  style,
}) => {
  return (
    <Modal
      open={open}
      onClose={onClose}
      onEscapePress={onClose}
      onOutsideAction={onClose}
    >
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
          >
            {items}
          </Carousel>
        </div>

        {/* <div className={styles.recipeCarousel}>
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
        </div> */}
      </div>
    </Modal>
  );
};

export default RecipeModal;
