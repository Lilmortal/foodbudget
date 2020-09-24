import { errors as puppeteerErrors } from "puppeteer";
import config, { Config } from "../../config";
import { Recipe, RecipeRepository } from "../../repository/recipe";
import { RepositoryError } from "../../repository/RepositoryError";
import { Emailer, EmailError } from "../../services/email";
import { WebPageScrapedRecipeInfo } from "../scraper";
import { Scrape } from "../scraper/Scrape";
import { ScraperError } from "../scraper/ScraperError";
import { ScraperConnections, ScraperJob } from "./RecipesJob.types";
import { validate } from "./RecipesJob.utils";

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
    let recipes: Recipe[] = [];
    try {
      const scrapedRecipes = await Scrape.recipe(scrapedWebsiteInfo);

      const validatedRecipe = validate(scrapedRecipes);

      if (Array.isArray(validatedRecipe)) {
        recipes = recipes.concat(
          validatedRecipe.map((recipe) => ({
            ...recipe,
            cuisines: [],
            diets: [],
            allergies: [],
          }))
        );
      }
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
      await this.recipeRepository.create(recipes);
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
