import { PageInfo } from "../../jobs/scraper";

const pageInfo: PageInfo[] = [
  {
    url:
      "https://www.recipes.co.nz/shop/EVERYDAY/BalsamicTomatoSlowCookerLambShanks.html",
    prepTimeSelector: {
      class: ".icon_wrapper .left_col .icon .label",
      index: 0,
      substring: {
        start: 6,
      },
    },
    servingsSelector: {
      class: ".icon_wrapper .left_col .icon .label",
      index: 2,
      substring: {
        start: 6,
      },
    },
    recipeNameSelector: {
      class: ".product_info .title",
      index: 0,
      substring: {
        start: 0,
      },
    },
    ingredientsSelector: {
      class: ".ingredients ul li",
    },
  },
];

export default pageInfo;
