import { ScrapeError } from '@foodbudget/errors';
import Scraper from './Scraper';
import { OnScrape } from './Scraper.types';

describe('scraper', () => {
  beforeEach(() => {
    jest.setTimeout(30000);
  });

  afterEach(() => {
    jest.setTimeout(5000);
  });

  it('should return the scraped result given the onScrape and mapping function', async () => {
    const onScrape: OnScrape<number> = async (info: string) => {
      const parsedInfo = JSON.parse(info);
      return Number(parsedInfo.num) * 2;
    };

    const mapping = (scrapedResults: number) => `${scrapedResults}mapped`;

    const scraper = new Scraper<number, string>({ onScrape, mapping });

    const info = { url: 'https://doesnotexist.com', num: 2 };
    const result = await scraper.scrape(info);
    expect(result).toEqual('4mapped');
  });

  it('should throw a ScrapeError if the onScrape function failed', async () => {
    const onScrape: OnScrape<number> = async () => {
      throw new Error();
    };

    const mapping = (scrapedResults: number) => `${scrapedResults}mapped`;

    const scraper = new Scraper<number, string>({ onScrape, mapping });

    const info = { url: 'https://doesnotexist.com', num: 2 };
    await expect(scraper.scrape(info)).rejects.toThrow(ScrapeError);
  });
});