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
  scrape(scrapedWebsiteInfo: WebPageScrapedRecipeInfo[]): Promise<void>;
}

interface ScraperJob extends ScraperConnections, ScraperService {}

export class RecipeScraperJob implements ScraperJob {
  recipeRepository: RecipeRepository;
  emailer: Emailer;

  constructor({ recipeRepository, emailer }: ScraperConnections) {
    this.recipeRepository = recipeRepository;
    this.emailer = emailer;
  }

  async scrape(scrapedWebsiteInfo: WebPageScrapedRecipeInfo[]) {
    let recipe: Recipe | undefined;
    try {
      recipe = await Scrape.recipe(scrapedWebsiteInfo);

      if (recipe === undefined) {
        throw new Error("Failed to scrape recipe.");
      }
    } catch (err) {
      throw new ScraperError(err);
    }

    console.log("saving new recipe...");
    console.log(recipe);

    try {
      this.recipeRepository.create(recipe);
    } catch (err) {
      throw new RepositoryError(err);
    }

    // send an email notification that a new website page has been scraped, and require
    // additional manual insertion of the remaining properties.
    try {
      this.emailer.send({
        from: config.email.user,
        to: config.email.user,
        subject: `recipe ${recipe.name} has been scraped.`,
        text: "Now we just have to manuallly input the remaining criterias.",
      });
    } catch (err) {
      throw new EmailError(err);
    }
  }
}
