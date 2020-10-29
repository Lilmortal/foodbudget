import logger from '@foodbudget/logger';
import puppeteer from 'puppeteer';
import { OnScrape, ScrapedElements } from '../Scraper.types';

export function setupHeadlessBrowser<E extends ScrapedElements, S>(
    onScrape: OnScrape<S>
  ): { scrape: (scrapedElements: E | E[]) => Promise<S | S[]> };
export function setupHeadlessBrowser<E extends ScrapedElements, S>(
    onScrape: OnScrape<S>
  ): { scrape: (scrapedElements: E) => Promise<S> };
export function setupHeadlessBrowser<E extends ScrapedElements, S>(
    onScrape: OnScrape<S>
  ): { scrape: (scrapedElements: E[]) => Promise<S[]> };
export default function setupHeadlessBrowser<E extends ScrapedElements, S>(
  onScrape: OnScrape<S>,
): { scrape: (scrapedElements: E | E[]) => Promise<S | S[]> } {
  return {
    scrape: async (scrapedElements: E | E[]): Promise<S | S[]> => {
      const browser = await puppeteer.launch({ args: ['--no-sandbox', '--disable-setuid-sandbox'] });

      try {
        const page = await browser.newPage();

        const getScrapedResults = async (scrapedPageInfo: E): Promise<S> => {
          await page.goto(scrapedPageInfo.url);

          const scrapedResults = await onScrape(page)(JSON.stringify(scrapedPageInfo));

          return scrapedResults;
        };

        // This enables us to read all console logs being displayed in the puppeteer browser in our terminal.
        page.on('console', (msg) => logger.info(msg.text()));

        let scrapedResults: S | S[];
        if (Array.isArray(scrapedElements)) {
          scrapedResults = await Promise.all(
            scrapedElements.map(async (scrapedElement) => getScrapedResults(scrapedElement)),
          );
        } else {
          scrapedResults = await getScrapedResults(scrapedElements);
        }

        return scrapedResults;
      } finally {
        await browser.close();
      }
    },
  };
}
