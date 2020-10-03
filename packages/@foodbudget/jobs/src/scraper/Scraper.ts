import { ScrapeError } from '@foodbudget/errors';
import {
  ScraperParams,
  ScraperInterface,
  ScrapedElements, OnScrape,
} from './Scraper.types';
import setupHeadlessBrowser from './utils';

export default class Scraper<S, R> implements ScraperInterface<R> {
  readonly #onScrape: OnScrape<S>;

  readonly #mapping: (scrapedResult: S) => R;

  constructor({ onScrape, mapping }: ScraperParams<S, R>) {
    this.#onScrape = onScrape;
    this.#mapping = mapping;
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
      const headlessBrowser = setupHeadlessBrowser<E, S>(this.#onScrape);

      const scrapedResults = await headlessBrowser.scrape(scrapedElements);

      if (Array.isArray(scrapedResults)) {
        return Promise.all(scrapedResults.map((result) => this.#mapping(result)));
      }

      return this.#mapping(scrapedResults);
    } catch (err) {
      // @TODO: Find where TimeoutError is.
      // if (err instanceof puppeteer.errors.TimeoutError) {
      if (err instanceof Error) {
        if (retries <= 0) {
          throw new ScrapeError(err.message);
        }

        return this.scrape(scrapedElements, retries - 1);
      }
      throw new ScrapeError(err);
    }
  }
}
