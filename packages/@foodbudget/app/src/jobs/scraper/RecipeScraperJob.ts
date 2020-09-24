import { errors as puppeteerErrors } from "puppeteer";
import config from "../../config";
import { Recipe, RecipeRepository } from "../../repository/recipe";
import { RepositoryError } from "../../repository/RepositoryError";
import { Emailer, EmailError } from "../../services/email";
import { Scrape, WebPageScrapedRecipeInfo } from "./Scrape";
import { ScraperError } from "./ScraperError";

// @TODO: Think of a better name...
export interface ScraperConnections {
  recipeRepository: RecipeRepository;
  emailer: Emailer;
}

interface ScraperService {
  scrape(
    scrapedWebsiteInfo: WebPageScrapedRecipeInfo[],
    retries?: number
  ): Promise<void>;
}

interface ScraperJob extends ScraperConnections, ScraperService {}

export class RecipeScraperJob implements ScraperJob {
  recipeRepository: RecipeRepository;
  emailer: Emailer;

  constructor({ recipeRepository, emailer }: ScraperConnections) {
    this.recipeRepository = recipeRepository;
    this.emailer = emailer;
  }

  async scrape(
    scrapedWebsiteInfo: WebPageScrapedRecipeInfo[],
    retries?: number
  ) {
    let recipes: Recipe[];
    try {
      recipes = await Scrape.recipe(scrapedWebsiteInfo);
    } catch (err) {
      if (err instanceof puppeteerErrors.TimeoutError) {
        // @TODO put retries in config
        await this.scrape(
          scrapedWebsiteInfo,
          retries === undefined ? 3 : retries--
        );

        if (retries === 0) {
          throw new ScraperError(err.message);
        }

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
}
