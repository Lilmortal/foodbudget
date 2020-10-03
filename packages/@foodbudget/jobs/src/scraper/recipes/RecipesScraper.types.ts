import { Recipe } from '@foodbudget/app';
import { ScrapedElements, ScrapedHTMLElement } from '../Scraper.types';

export interface ScrapedRecipeHTMLElements extends ScrapedElements {
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

export type ScrapedRecipe = Record<keyof Recipe, string | string[]>;