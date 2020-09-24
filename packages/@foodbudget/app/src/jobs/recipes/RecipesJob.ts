import { errors as puppeteerErrors } from "puppeteer";
import config, { Config } from "../../config";
import { Recipe, RecipeRepository } from "../../repository/recipe";
import { RepositoryError } from "../../repository/RepositoryError";
import { Emailer, EmailError } from "../../services/email";
import { Scrape, WebPageScrapedRecipeInfo } from "../scraper/Scrape";
import { ScraperError } from "../scraper/ScraperError";
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

interface ScraperService {
  /**
   * Given information like the document elements etc, use it to scrape the recipe website.
   *
   * @param scrapedWebsiteInfo Recipe website document elements used to scrape relevant information.
   * @param retries An optional number used to signify how many attempts can be made to connect to puppeteer.
   */
  scrape(
    scrapedWebsiteInfo: WebPageScrapedRecipeInfo[],
    retries?: number
  ): Promise<void>;
}

interface ScraperJob extends ScraperConnections, ScraperService, Job {}

export class RecipesJob implements ScraperJob {
  recipeRepository: RecipeRepository;
  emailer: Emailer;

  constructor({ recipeRepository, emailer }: ScraperConnections) {
    this.recipeRepository = recipeRepository;
    this.emailer = emailer;
  }

  async scrape(
    scrapedWebsiteInfo: WebPageScrapedRecipeInfo[],
    retries: number
  ) {
    let recipes: Recipe[];
    try {
      recipes = await Scrape.recipe(scrapedWebsiteInfo);
    } catch (err) {
      if (err instanceof puppeteerErrors.TimeoutError) {
        if (retries <= 0) {
          throw new ScraperError(err.message);
        }

        await this.scrape(scrapedWebsiteInfo, retries--);
        return;
      }
      throw new ScraperError(err);
    }

    console.log("saving new recipes...");
    console.log(recipes);

    try {
      await this.recipeRepository.create(recipes[0]);
    } catch (err) {
      throw new RepositoryError(err);
    }

    // send an email notification that a new website page has been scraped, and require
    // additional manual insertion of the remaining properties.
    try {
      await Promise.all(
        recipes.map((recipe) => {
          this.emailer.send({
            from: config.email.user,
            to: config.email.user,
            subject: `recipe ${recipe.name} has been scraped.`,
            text:
              "Now we just have to manuallly input the remaining criterias.",
          });
        })
      );
      console.log("email sent.");
    } catch (err) {
      throw new EmailError(err);
    }
  }

  async start(config: Config) {
    await this.scrape(
      config.scrapedWebsiteInfo,
      config.headlessBrowser.retries
    );
  }
}
