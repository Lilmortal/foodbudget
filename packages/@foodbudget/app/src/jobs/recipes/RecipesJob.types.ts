import { Recipe, RecipeRepository } from "../../repository/recipe";
import { Emailer } from "../../services/email";
import { WebPageScrapedRecipeInfo } from "../scraper";
import { Job } from "../shared/Job.type";

// @TODO: Think of a better name...
export interface ScraperConnections {
  /**
   * Repository used to save the Recipe that is been scraped.
   */
  recipeRepository: RecipeRepository;
  /**
   * Emailer used to send a confirmation email that recipes has been scraped.
   */
  emailer: Emailer;
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
   */
  notify(recipes: Recipe[]): Promise<void>;
}

export interface ScraperJob extends ScraperConnections, ScraperService, Job {}

export interface ScrapedRecipe
  extends Record<
    keyof Pick<
      Recipe,
      "prepTime" | "servings" | "name" | "ingredients" | "link"
    >,
    string | string[]
  > {}
