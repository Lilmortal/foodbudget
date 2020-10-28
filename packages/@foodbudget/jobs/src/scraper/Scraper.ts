import { AppError } from '@foodbudget/errors';
import logger from '@foodbudget/logger';
import {
  ScraperParams,
  ScrapedElements, OnScrape,
} from './Scraper.types';
import setupHeadlessBrowser from './utils';

export default class Scraper<S, R> {
  private readonly onScrape: OnScrape<S>;

  private readonly onMapping: (scrapedResult: S) => R;

  constructor({ onScrape, onMapping }: ScraperParams<S, R>) {
    this.onScrape = onScrape;
    this.onMapping = onMapping;
  }

  async scrape<E extends ScrapedElements>(
    scrapedElements: E,
    retries?: number
  ): Promise<R>;

  async scrape<E extends ScrapedElements>(
    scrapedElements: E[],
    retries?: number
  ): Promise<R[]>;

  async scrape<E extends ScrapedElements>(
    scrapedElements: E | E[],
    retries?: number
  ): Promise<R | R[]>;

  async scrape<E extends ScrapedElements>(
    scrapedElements: E | E[],
    retries = 3,
  ): Promise<R | R[]> {
    try {
      const headlessBrowser = setupHeadlessBrowser<E, S>(this.onScrape);

      const scrapedResults = await headlessBrowser.scrape(scrapedElements);

      if (Array.isArray(scrapedResults)) {
        return Promise.all(scrapedResults.map((result) => this.onMapping(result)));
      }

      return this.onMapping(scrapedResults);
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
