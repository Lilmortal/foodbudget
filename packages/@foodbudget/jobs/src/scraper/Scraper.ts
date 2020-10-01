import puppeteer from 'puppeteer';
import { ScrapeError } from '@foodbudget/errors';
import {
  ScraperParams,
  ScraperInterface,
  ScrapedElements, OnScrape,
} from './Scraper.types';

function setupHeadlessBrowser<E extends ScrapedElements, S>(
  onScrape: OnScrape<S>
): { scrape: (scrapedElements: E | E[]) => Promise<S | S[]> };
function setupHeadlessBrowser<E extends ScrapedElements, S>(
  onScrape: OnScrape<S>
): { scrape: (scrapedElements: E) => Promise<S> };
function setupHeadlessBrowser<E extends ScrapedElements, S>(
  onScrape: OnScrape<S>
): { scrape: (scrapedElements: E[]) => Promise<S[]> };
function setupHeadlessBrowser<E extends ScrapedElements, S>(
  onScrape: OnScrape<S>,
) {
  return {
    scrape: async (scrapedElements: E | E[]): Promise<S | S[]> => {
      const browser = await puppeteer.launch({ args: ['--no-sandbox', '--disable-setuid-sandbox'] });
      const page = await browser.newPage();

      const getScrapedResults = async (scrapedPageInfo: E): Promise<S> => {
        await page.goto(scrapedPageInfo.url);

        // We pass the page info as a serialized JSON object into the puppeteer browser.
        const scrapedResults: S | S[] = await page.evaluate(
          onScrape,
          JSON.stringify(scrapedPageInfo),
        );

        return scrapedResults;
      };

      // This enables us to read all console logs being displayed in the puppeteer browser in our terminal.
      page.on('console', (msg) => console.log(msg.text()));

      let scrapedResults: S | S[];
      if (Array.isArray(scrapedElements)) {
        scrapedResults = await Promise.all(
          scrapedElements.map(async (scrapedElement) => getScrapedResults(scrapedElement)),
        );
      } else {
        scrapedResults = await getScrapedResults(scrapedElements);
      }
      await browser.close();

      return scrapedResults;
    },
  };
}

export default class Scraper<S, R> implements ScraperInterface<R> {
  readonly #onScrape: (scrapeInfo: string) => Promise<S>;

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
        console.log(err);
        if (retries <= 0) {
          throw new ScrapeError(err.message);
        }

        return this.scrape(scrapedElements, retries - 1);
      }
      throw new ScrapeError(err);
    }
  }
}
