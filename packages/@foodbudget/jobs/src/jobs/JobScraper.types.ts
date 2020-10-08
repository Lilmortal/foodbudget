import { ServiceManager } from '@foodbudget/api';
import { Mail, Mailer } from '../../../email/src';
import { Job } from '../cron';
import RecipesScraper from '../scraper/recipes/RecipesScraper';
import { ScrapedRecipe } from '../scraper/recipes/RecipesScraper.types';
import { ScrapedElements } from '../scraper/Scraper.types';

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

export interface JobScraperInterface<S extends ScrapedElements, R> extends Job {
    /**
     * Scrape the items.
     * @param scrapedElements elements used to determine how to scrape the items.
     */
    scrape(scrapedElements: S | S[]): Promise<(R | R[])[]>;

    /**
     * Save the scraped items to the database.
     * @param scrapedItems items that have been scraped.
     */
    save(scrapedItems: R | R[]): void;

    /**
     * Notify the receiver that the items have been scraped.
     * @param scrapedItems scraped items that will be sent to the user via email.
     * @param mailParticipants the sender and the receiver of the email.
     */
    notify(scrapedItems: R | R[], mailParticipants: Pick<Mail, 'from' | 'to'>): void;
}
