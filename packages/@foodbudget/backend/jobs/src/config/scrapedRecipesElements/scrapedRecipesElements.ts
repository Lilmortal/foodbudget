import { ScrapedRecipeHTMLElements } from '../../scraper/recipes/RecipesScraper.types';

const scrapedRecipeElements: ScrapedRecipeHTMLElements[] = [
  {
    url: 'https://www.recipes.co.nz/shop/EVERYDAY/x_item_sort_by/page/page/1.html',
    itemHtmlElement: {
      class: '.image a',
    },
    prepTimeHtmlElement: {
      class: '.icon_wrapper .left_col .icon .label',
      index: 0,
      substring: {
        start: 6,
      },
    },
    servingsHtmlElement: {
      class: '.icon_wrapper .left_col .icon .label',
      index: 2,
      substring: {
        start: 6,
      },
    },
    recipeNameHtmlElement: {
      class: '.product_info .title',
      index: 0,
      substring: {
        start: 0,
      },
    },
    ingredientsHtmlElement: {
      class: '.ingredients ul li',
    },
  },
];

export default scrapedRecipeElements;
