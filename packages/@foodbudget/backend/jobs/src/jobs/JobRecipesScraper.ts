import { Mail, Mailer } from '@foodbudget/email';
import { Recipe, ServiceManager } from '@foodbudget/api';
import logger from '@foodbudget/logger';
import { Config } from '../config';
import { RecipesScraper, ScrapedRecipeHTMLElements } from '../scraper/recipes';
import { JobScraperParams } from './JobScraper.types';
import { ScrapedRecipe } from '../scraper/recipes/RecipesScraper.types';

export default class JobRecipesScraper {
  interval = '1000 seconds';

  definition = 'Job recipes';

  readonly serviceManager: ServiceManager;

  readonly emailer: Mailer;

  private readonly recipeScrapers: RecipesScraper<ScrapedRecipe>[];

  constructor({ serviceManager, emailer, recipeScrapers }: JobScraperParams) {
    this.serviceManager = serviceManager;
    this.emailer = emailer;
    this.recipeScrapers = recipeScrapers;
  }

  async scrape(scrapedElements: ScrapedRecipeHTMLElements | ScrapedRecipeHTMLElements[]):
  Promise<(Omit<Recipe, 'id'> | Omit<Recipe, 'id'>[])[]> {
    return Promise.all(this.recipeScrapers.map(async (scraper) => scraper.scrape(scrapedElements)));
  }

  async save(recipes: Omit<Recipe, 'id'> | Omit<Recipe, 'id'>[]): Promise<void> {
    await this.serviceManager.recipeServices.save(recipes);
  }

  async notify(recipes: Omit<Recipe, 'id'> | Omit<Recipe, 'id'>[], mailParticipants: Pick<Mail, 'from' | 'to'>):
  Promise<void> {
    const getConfirmationMail = (recipeNames: string): Mail => ({
      subject: `recipe ${recipeNames} has been scraped.`,
      text: 'Now we just have to manually input the remaining criterias.',
      ...mailParticipants,
    });

    let recipeNames = '';
    if (Array.isArray(recipes)) {
      recipeNames = recipes.map((recipe) => recipe.name).join(', ');
    } else {
      recipeNames = recipes.name;
    }
    this.emailer.send(getConfirmationMail(recipeNames));
  }

  async start(config: Config): Promise<void> {
    logger.info('Scraping recipes...');
    const scrapedRecipes = await this.scrape(config.scrapedRecipeElements);

    await Promise.all(scrapedRecipes.map(async (scrapedRecipe) => {
      logger.info('Successfully scraped recipe.');
      logger.info(`Scraped recipe: ${JSON.stringify(scrapedRecipe, null, 2)}`);

      await this.save(scrapedRecipe);

      logger.info('recipes saved.');

      await this.notify(scrapedRecipe, { from: config.email.sender, to: config.email.receiver });

      logger.info('recipe emails sent.');
    }));
  }
}
