import { AppError } from '@foodbudget/errors';
import logger from '@foodbudget/logger';
import { ScraperParams, ScrapedElements, OnScrape } from './Scraper.types';
import setupHeadlessBrowser from './utils';

export default class Scraper<S, R> {
  private readonly onScrape: OnScrape<S[]>;

  private readonly onMapping: (scrapedResult: S) => R;

  constructor({ onScrape, onMapping }: ScraperParams<S, R>) {
    this.onScrape = onScrape;
    this.onMapping = onMapping;
  }

  async scrape<E extends ScrapedElements>(
    scrapedElements: E[],
    retries = 3,
  ): Promise<R[]> {
    try {
      const headlessBrowser = setupHeadlessBrowser<E, S>(this.onScrape);

      const scrapedResults = await headlessBrowser.scrape(scrapedElements);

      return Promise.all(
        scrapedResults.map((result) => this.onMapping(result)),
      );
    } catch (err) {
      // @TODO: Find where puppeteer.errors.TimeoutError is.
      if (err instanceof Error) {
        if (retries <= 0) {
          throw err;
        }

        logger.warn(`Reattempt tries left: ${retries}`, err);
        return this.scrape(scrapedElements, retries - 1);
      }
      throw new AppError({ message: err.message || err, isOperational: true });
    }
  }
}
