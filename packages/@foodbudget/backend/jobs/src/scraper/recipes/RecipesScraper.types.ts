import { Recipe } from '@foodbudget/api';
import Scraper from '../Scraper';
import { ScrapedElements, ScrapedHTMLElement } from '../Scraper.types';

export interface ScrapedRecipeHTMLElements extends ScrapedElements {
  /**
   * Recipe items to loop through to scrape.
   */
  recipeItemHtmlElement?: ScrapedHTMLElement;
  /**
   * The element for prep time.
   */
  prepTimeHtmlElement: ScrapedHTMLElement;
  /**
   * The element for servings.
   */
  servingsHtmlElement: ScrapedHTMLElement;
  /**
   * The element for the recipe name.
   */
  recipeNameHtmlElement: ScrapedHTMLElement;
  /**
   * The element for a list of ingredients.
   */
  ingredientsHtmlElement: ScrapedHTMLElement;
}

export type ScrapedRecipe = Record<keyof Omit<Recipe, 'id'>, string | string[]>;

export type RecipesScraper = Scraper<ScrapedRecipe, Omit<Recipe, 'id'>>;
