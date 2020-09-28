import { Recipe } from '../../repository/recipe';
import { Repository } from '../../repository';
import { Mail, Mailer } from '../../services/email';
import { DocumentNode } from '../scraper';
import { Job } from '../shared';

// @TODO: Think of a better name...
export interface WebPageScrapedRecipeInfo {
  /**
   * The URL of the scraped web page.
   */
  url: string;
  /**
   * The selector for prep time.
   */
  prepTimeSelector: DocumentNode;
  /**
   * The selector for servings.
   */
  servingsSelector: DocumentNode;
  /**
   * The selector for the recipe name.
   */
  recipeNameSelector: DocumentNode;
  /**
   * The selector for a list of ingredients.
   */
  ingredientsSelector: DocumentNode;
}

export interface ScraperParams {
  /**
   * Repository used to save the Recipe that is been scraped.
   */
  recipeRepository: Repository<Recipe>;
  /**
   * Emailer used to send a confirmation email that recipes has been scraped.
   */
  emailer: Mailer;
}

export interface ScraperService {
  scrape(
    scrapedWebsiteInfo: WebPageScrapedRecipeInfo,
    retries: number
  ): Promise<Recipe>;
  scrape(
    scrapedWebsiteInfo: WebPageScrapedRecipeInfo[],
    retries: number
  ): Promise<Recipe[]>;
  /**
   * Given information like the document elements etc, use it to scrape the recipe website.
   *
   * @param scrapedWebsiteInfo Recipe website document elements used to scrape relevant information.
   * @param retries An optional number used to signify how many attempts can be made to connect to puppeteer.
   */
  scrape(
    scrapedWebsiteInfo: WebPageScrapedRecipeInfo | WebPageScrapedRecipeInfo[],
    retries: number
  ): Promise<Recipe | Recipe[]>;

  /**
   * Save the recipes to the database.
   * @param recipes recipes that have been scraped.
   */
  save(recipes: Recipe[]): Promise<void>;

  /**
   * Notify the receiver that recipes have been scraped.
   * @param recipes recipes that will be sent to the user via email.
   * @param mailParticipants the sender and the receiver of the email.
   */
  notify(recipes: Recipe[], mailParticipants: Pick<Mail, 'from' | 'to'>): Promise<void>;
}

export interface ScraperJob extends ScraperParams, ScraperService, Job {}

export type ScrapedRecipe = Record<
    keyof Pick<
      Recipe,
      'prepTime' | 'servings' | 'name' | 'ingredients' | 'link'
    >,
    string | string[]
  >
