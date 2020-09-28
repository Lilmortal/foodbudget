import { errors as puppeteerErrors } from 'puppeteer';
import { Config } from '../../config';
import { Recipe } from '../../repository/recipe';
import { Repository, RepositoryError } from '../../repository';
import { EmailError, Mail, Mailer } from '../../services/email';
import { ScrapeError } from '../scraper';
import {
  ScraperParams,
  ScraperJob,
  WebPageScrapedRecipeInfo,
} from './RecipesJob.types';
import { validate } from './RecipesJob.utils';
import { RecipesJobScraper } from './RecipesJobScraper';

class RecipesJob implements ScraperJob {
  interval = '10 seconds';

  definition='Recipe scrape'

  recipeRepository: Repository<Recipe>;

  emailer: Mailer;

  constructor({ recipeRepository, emailer }: ScraperParams) {
    this.recipeRepository = recipeRepository;
    this.emailer = emailer;
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
    retries = 3,
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
          throw new ScrapeError(err.message);
        }

        return this.scrape(scrapedWebsiteInfo, retries - 1);
      }
      throw new ScrapeError(err);
    }

    return recipes;
  }

  async save(recipes: Recipe | Recipe[]): Promise<void> {
    try {
      await this.recipeRepository.create(recipes);
    } catch (err) {
      throw new RepositoryError(err);
    }
  }

  async notify(recipes: Recipe | Recipe[], mailParticipants: Pick<Mail, 'from' | 'to'>): Promise<void> {
    const getConfirmationMail = (recipe: Recipe): Mail => ({

      subject: `recipe ${recipe.name} has been scraped.`,
      text: 'Now we just have to manuallly input the remaining criterias.',
      ...mailParticipants,
    });

    try {
      if (Array.isArray(recipes)) {
        await Promise.all(
          recipes.map((recipe) => this.emailer.send(getConfirmationMail(recipe))),
        );
      } else {
        this.emailer.send(getConfirmationMail(recipes));
      }
    } catch (err) {
      throw new EmailError(err);
    }
  }

  async start(config: Config): Promise<void> {
    const recipes = await this.scrape(
      config.scrapedWebsiteInfo,
      config.headlessBrowser.retries,
    );

    console.log('Successfully scraped recipes...');
    console.log(recipes);

    await this.save(recipes);

    console.log('recipes saved.');

    await this.notify(recipes, {
      from: config.email.user,
      to: config.email.user,
    });

    console.log('recipe emails sent.');
  }
}

export default RecipesJob;
