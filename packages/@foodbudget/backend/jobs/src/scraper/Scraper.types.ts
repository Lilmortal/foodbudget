import puppeteer from 'puppeteer';

export interface ScrapedHTMLElement {
  /**
   * The class name of the document node. e.g. ".class1 .class2"
   */
  class: string;
  /**
   * If specified, returns the indexed document node. If omitted, return an array of all filtered document nodes.
   */
  index?: number;
  /**
   * If specified, substring the scraped string.
   */
  substring?: {
    /**
     * Starting position.
     */
    start: number;
    /**
     * Ending position.
     */
    end?: number;
  };
}

export interface ScrapedElements {
  /**
   * The URL of the scraped web page.
   */
  url: string;
}

export type OnScrape<S> = (
  page: puppeteer.Page,
) => (scrapeInfo: string) => Promise<S>;

export interface ScraperParams<S, R> {
  /**
   * Scraping function that will be triggered inside the headless browser.
   */
  onScrape: OnScrape<S[]>;

  /**
   * Validate function that will be used to validate the scraped result.
   */
  onMapping: (scrapedResult: S) => R;
}
