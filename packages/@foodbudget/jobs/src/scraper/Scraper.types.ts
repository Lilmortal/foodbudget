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

export type OnScrape<S> = (scrapeInfo: string) => Promise<S>;

export interface ScraperParams<S, R> {
  /**
   * Scraping function that will be triggered inside the headless browser.
   */
  onScrape: OnScrape<S>;

  /**
   * Validate function that will be used to validate the scraped result.
   */
  mapping: (scrapedResult: S) => R;
}

export interface ScraperInterface<R> {
  scrape<S extends ScrapedElements>(
    scrapedElements: S,
    retries: number
  ): Promise<R>;
  scrape<S extends ScrapedElements>(
    scrapedElements: S[],
    retries: number
  ): Promise<R[]>;
  /**
   * Given information like the document elements etc, use it to scrape the website.
   *
   * @param scrapedElements website document elements used to scrape relevant information.
   * @param retries An optional number used to signify how many attempts can be made to connect to headless browser.
   */
  scrape<S extends ScrapedElements>(
    scrapedElements: S | S[],
    retries: number
  ): Promise<R | R[]>;
}
