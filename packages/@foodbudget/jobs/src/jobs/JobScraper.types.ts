import { ServiceManager } from '@foodbudget/api';
import { Mailer } from '../../../email/src';
import RecipesScraper from '../scraper/recipes/RecipesScraper';
import { ScrapedRecipe } from '../scraper/recipes/RecipesScraper.types';

export interface JobScraperParams {
    /**
     * Repository used to save the scraped items that is been scraped.
     */
    serviceManager: ServiceManager;

    /**
     * Emailer used to send a confirmation email that the items has been scraped.
     */
    emailer: Mailer;

    /**
     * A list of recipe scrapers that will be used to scrape the items.
     */
    recipeScrapers: RecipesScraper<ScrapedRecipe>[];
}
