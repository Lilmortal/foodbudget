import { EmailError, RepositoryError } from '@foodbudget/errors';
import { Mail, Mailer } from '@foodbudget/email';
import { Recipe, ServiceManager } from '@foodbudget/api';
import { Config } from '../config';
import { RecipesScraper, ScrapedRecipeHTMLElements } from '../scraper/recipes';
import { JobScraperInterface, JobScraperParams } from './JobScraper.types';
import { ScrapedRecipe } from '../scraper/recipes/RecipesScraper.types';

export default class JobRecipesScraper implements JobScraperInterface<ScrapedRecipeHTMLElements, Recipe> {
  interval = '1000 seconds';

  definition = 'Job recipes';

  readonly serviceManager: ServiceManager;

  readonly emailer: Mailer;

  readonly #recipeScrapers: RecipesScraper<ScrapedRecipe>[];

  constructor({ serviceManager, emailer, recipeScrapers }: JobScraperParams) {
    this.serviceManager = serviceManager;
    this.emailer = emailer;
    this.#recipeScrapers = recipeScrapers;
  }

  async scrape(scrapedElements: ScrapedRecipeHTMLElements | ScrapedRecipeHTMLElements[]): Promise<(Recipe | Recipe[])[]> {
    return Promise.all(this.#recipeScrapers.map(async (scraper) => scraper.scrape(scrapedElements)));
  }

  async save(recipes: Recipe | Recipe[]): Promise<void> {
    try {
      await this.serviceManager.recipeServices.save(recipes);
    } catch (err) {
      throw new RepositoryError(err);
    }
  }

  async notify(recipes: Recipe | Recipe[], mailParticipants: Pick<Mail, 'from' | 'to'>): Promise<void> {
    const getConfirmationMail = (recipeNames: string): Mail => ({
      subject: `recipe ${recipeNames} has been scraped.`,
      text: 'Now we just have to manually input the remaining criterias.',
      ...mailParticipants,
    });

    let recipeNames = '';
    try {
      if (Array.isArray(recipes)) {
        recipeNames = recipes.map((recipe) => recipe.name).join(', ');
      } else {
        recipeNames = recipes.name;
      }
      this.emailer.send(getConfirmationMail(recipeNames));
    } catch (err) {
      throw new EmailError(err);
    }
  }

  async start(config: Config): Promise<void> {
    const scrapedRecipes = await this.scrape(config.scrapedRecipeElements);

    await Promise.all(scrapedRecipes.map(async (scrapedRecipe) => {
      console.log(scrapedRecipe);
      console.log('Successfully scraped recipes...');

      await this.save(scrapedRecipe);

      console.log('recipes saved.');

      await this.notify(scrapedRecipe, { from: config.email.sender, to: config.email.receiver });

      console.log('recipe emails sent.');
    }));
  }
}
