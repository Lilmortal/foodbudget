import { errors as puppeteerErrors } from "puppeteer";
import config, { Config } from "../../config";
import { Recipe, RecipeRepository } from "../../repository/recipe";
import { RepositoryError } from "../../repository/RepositoryError";
import { Emailer, EmailError, Mail } from "../../services/email";
import { ScraperError } from "../scraper/ScraperError";
import {
  ScraperConnections,
  ScraperJob,
  WebPageScrapedRecipeInfo,
} from "./RecipesJob.types";
import { validate } from "./RecipesJob.utils";
import { RecipesJobScraper } from "./RecipesJobScraper";

export class RecipesJob implements ScraperJob {
  recipeRepository: RecipeRepository;
  emailer: Emailer;

  constructor({ recipeRepository, emailer }: ScraperConnections) {
    this.recipeRepository = recipeRepository;
    this.emailer = emailer;
  }

  get interval() {
    return "10 seconds";
  }

  get definition() {
    return "Recipe scrape";
  }

  async scrape(
    scrapedWebsiteInfo: WebPageScrapedRecipeInfo,
    retries: number
  ): Promise<Recipe>;
  async scrape(
    scrapedWebsiteInfo: WebPageScrapedRecipeInfo[],
    retries: number
  ): Promise<Recipe[]>;
  async scrape(
    scrapedWebsiteInfo: WebPageScrapedRecipeInfo | WebPageScrapedRecipeInfo[],
    retries: number
  ): Promise<Recipe | Recipe[]>;
  async scrape(
    scrapedWebsiteInfo: WebPageScrapedRecipeInfo | WebPageScrapedRecipeInfo[],
    retries: number = 3
  ): Promise<Recipe | Recipe[]> {
    let recipes: Recipe | Recipe[];
    try {
      const scrapedRecipes = await RecipesJobScraper.scrape(scrapedWebsiteInfo);

      const validatedRecipes = validate(scrapedRecipes);

      if (Array.isArray(validatedRecipes)) {
        recipes = validatedRecipes.map((recipe) => ({
          ...recipe,
          cuisines: [],
          diets: [],
          allergies: [],
        }));
      } else {
        recipes = {
          ...validatedRecipes,
          cuisines: [],
          diets: [],
          allergies: [],
        };
      }
    } catch (err) {
      if (err instanceof puppeteerErrors.TimeoutError) {
        if (retries <= 0) {
          throw new ScraperError(err.message);
        }

        return this.scrape(scrapedWebsiteInfo, --retries);
      }
      throw new ScraperError(err);
    }

    return recipes;
  }

  async save(recipes: Recipe | Recipe[]) {
    try {
      await this.recipeRepository.create(recipes);
    } catch (err) {
      throw new RepositoryError(err);
    }

    return true;
  }

  async notify(recipes: Recipe | Recipe[]) {
    const getConfirmationMail = (recipe: Recipe): Mail => ({
      from: config.email.user,
      to: config.email.user,
      subject: `recipe ${recipe.name} has been scraped.`,
      text: "Now we just have to manuallly input the remaining criterias.",
    });

    try {
      if (Array.isArray(recipes)) {
        await Promise.all(
          recipes.map((recipe) => {
            this.emailer.send(getConfirmationMail(recipe));
          })
        );
      } else {
        this.emailer.send(getConfirmationMail(recipes));
      }
    } catch (err) {
      throw new EmailError(err);
    }

    return true;
  }

  async start(config: Config) {
    const recipes = await this.scrape(
      config.scrapedWebsiteInfo,
      config.headlessBrowser.retries
    );

    console.log("Successfully scraped recipes...");
    console.log(recipes);

    await this.save(recipes);

    console.log("recipes saved.");

    await this.notify(recipes);

    console.log("recipe emails sent.");
  }
}
