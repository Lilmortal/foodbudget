import puppeteer from "puppeteer";
import { ScrapeError } from "./ScrapeError";

function setupHeadlessBrowser<T extends { url: string }, R>(
  scrapeFunc: (info: string) => Promise<R>
): { scrape: (scrapedInfo: T | T[]) => Promise<R | R[]> };
function setupHeadlessBrowser<T extends { url: string }, R>(
  scrapeFunc: (info: string) => Promise<R>
): { scrape: (scrapedInfo: T) => Promise<R> };
function setupHeadlessBrowser<T extends { url: string }, R>(
  scrapeFunc: (info: string) => Promise<R>
): { scrape: (scrapedInfo: T[]) => Promise<R> };
function setupHeadlessBrowser<T extends { url: string }, R>(
  scrapeFunc: (info: string) => Promise<R>
) {
  return {
    scrape: async (scrapedDocumentNodes: T | T[]): Promise<R | R[]> => {
      const browser = await puppeteer.launch();
      const page = await browser.newPage();

      const scrape = async (scrapedPageInfo: T): Promise<R> => {
        await page.goto(scrapedPageInfo.url);

        // We pass the page info as a serialized JSON object into the puppeteer browser.
        const scrapedResults = await page.evaluate(
          scrapeFunc,
          JSON.stringify(scrapedPageInfo)
        );

        return scrapedResults;
      };

      // This enables us to read all console logs being displayed in the puppeteer browser in our terminal.
      page.on("console", (msg) => console.log(msg.text()));

      let scrapedResults: R | R[];
      if (Array.isArray(scrapedDocumentNodes)) {
        scrapedResults = await Promise.all(
          scrapedDocumentNodes.map(async (pageInfo) => await scrape(pageInfo))
        );
      } else {
        scrapedResults = await scrape(scrapedDocumentNodes);
      }
      await browser.close();

      return scrapedResults;
    },
  };
}

export interface ScraperService<T extends { url: string }, R> {
  scrape(info: T): Promise<R>;
  scrape(info: T[]): Promise<R[]>;
}

export class Scraper<T extends { url: string }, R>
  implements ScraperService<T, R> {
  scrapedFunction: (info: string) => Promise<R>;

  constructor(scrapedFunction: (info: string) => Promise<R>) {
    this.scrapedFunction = scrapedFunction;
  }

  async scrape(scrapedInfo: T): Promise<R>;
  async scrape(scrapedInfo: T[]): Promise<R[]>;
  async scrape(scrapedInfo: T | T[]): Promise<R | R[]>;
  async scrape(scrapedInfo: T | T[]): Promise<R | R[]> {
    const headlessBrowser = setupHeadlessBrowser<T, R>(this.scrapedFunction);

    let result: Promise<R | R[]>;
    try {
      result = headlessBrowser.scrape(scrapedInfo);
    } catch (err) {
      throw new ScrapeError(err);
    }
    return result;
  }
}
