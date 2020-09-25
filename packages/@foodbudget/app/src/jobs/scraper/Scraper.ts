import puppeteer from "puppeteer";

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
    scrape: async (scrapedInfo: T | T[]): Promise<R | R[]> => {
      const browser = await puppeteer.launch();
      const page = await browser.newPage();

      const scrape = async (pageInfo: T): Promise<R> => {
        await page.goto(pageInfo.url);

        // We pass the page info as a serialized JSON object into the puppeteer browser.
        const scrapedRecipe = await page.evaluate(
          scrapeFunc,
          JSON.stringify(pageInfo)
        );

        return scrapedRecipe;
      };

      // This enables us to read all console logs being displayed in the puppeteer browser in our terminal.
      page.on("console", (msg) => console.log(msg.text()));

      let scrapedRecipes: R | R[];
      if (Array.isArray(scrapedInfo)) {
        scrapedRecipes = await Promise.all(
          scrapedInfo.map(async (pageInfo) => scrape(pageInfo))
        );
      } else {
        scrapedRecipes = await scrape(scrapedInfo);
      }
      await browser.close();

      return scrapedRecipes;
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

  async scrape(scrapedInfo: T | T[]): Promise<R | R[]>;
  async scrape(scrapedInfo: T): Promise<R>;
  async scrape(scrapedInfo: T[]): Promise<R[]>;
  async scrape(scrapedInfo: T | T[]): Promise<R | R[]> {
    const headlessBrowser = setupHeadlessBrowser<T, R>(this.scrapedFunction);

    return headlessBrowser.scrape(scrapedInfo);
  }
}
