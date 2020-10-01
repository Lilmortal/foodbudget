import { Scraper } from "../..";
import { Recipe } from "../../../../../app/src/repository/recipe";
import { ScrapedRecipeHTMLElements } from "../RecipesScraper.types";

// eslint-disable-next-line import/prefer-default-export
export default class RecipesScraper extends Scraper<ScrapedRecipeHTMLElements, Recipe> {
  scrape: jest.fn(),
};
