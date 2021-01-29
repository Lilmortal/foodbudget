import { useState, useEffect } from 'react';
import Button from 'components/Button';
import Carousel from 'components/Carousel';
import Calendar from 'components/Calendar';
import classnames from 'classnames';
import MainPage from '../templates/MainPage';

import styles from './MealPlanPage.module.scss';

interface BudgetBalanceProps {
  header: string;
}

const BudgetBalance: React.FC<BudgetBalanceProps> = ({ header, children }) => (
  <div className={styles.balanceWrapper}>
    <p>{header}</p>

    {children}
  </div>
);

export type MealPlanPageProps = Styleable;

const MealPlanPage: React.FC<MealPlanPageProps> = ({ className, style }) => {
  const [items, setItems] = useState<React.ReactNode[]>([]);

  useEffect(() => {
    const slides = [];
    for (let i = 0; i <= 6; i += 1) {
      slides.push(
        <div tabIndex={0} key={`${i}-slide`}>
          {i}
        </div>,
      );
    }

    setItems(slides);
  }, []);

  const [hasMore, setHasMore] = useState(true);

  const loadMore = () => {
    setItems([
      ...items,
      <div tabIndex={0} key={'id-7'}>
        7
      </div>,
      <div tabIndex={0} key={'id-8'}>
        8
      </div>,
      <div tabIndex={0} key={'id-9'}>
        9
      </div>,
      <div tabIndex={0} key={'id-10'}>
        10
      </div>,
      <div tabIndex={0} key={'id-11'}>
        11
      </div>,
      <div tabIndex={0} key={'id-12'}>
        12
      </div>,
      <div tabIndex={0} key={'id-13'}>
        13
      </div>,
      <div tabIndex={0} key={'id-14'}>
        14
      </div>,
    ]);
    setHasMore(false);
  };

  return (
    <MainPage>
      <h1>Weekly Meal Plan</h1>

      <div className={classnames(styles.wrapper, className)} style={style}>
        <Calendar
          recipes={{ [new Date().toString()]: { breakfast: <div>Test</div> } }}
          className={styles.calendar}
        />

        <div className={styles.budgetBalanceWrapper}>
          <div className={styles.budgetBalancePanel}>
            <BudgetBalance header="Meal Plan Cost">$xxx.xx</BudgetBalance>
            <BudgetBalance header="Budget Remaining">$xxx.xx</BudgetBalance>
          </div>
        </div>

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

        <div className={classnames(styles.panel)}>
          <p>Edit</p>
          <div>
            <Button showCloseIcon>Eggs</Button>
          </div>
        </div>
      </div>
    </MainPage>
  );
};

export default MealPlanPage;
