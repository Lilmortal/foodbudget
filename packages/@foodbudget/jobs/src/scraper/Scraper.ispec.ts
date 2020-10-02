import Scraper from './Scraper';
import { OnScrape } from './Scraper.types';

describe('scraper', () => {
  beforeEach(() => {
    jest.setTimeout(30000);
  });

  afterEach(() => {
    jest.setTimeout(5000);
  });

  it('should run the given function and return the computed result', async () => {
    const onScrape: OnScrape<number> = async (info: string) => {
      const parsedInfo = JSON.parse(info);
      return Number(parsedInfo.num) * 2;
    };

    const mapping = (scrapedResults: number) => scrapedResults * 2;

    const scraper = new Scraper<number, number>({ onScrape, mapping });

    const info = { url: 'https://doesnotexist.com', num: 2 };
    const result = await scraper.scrape(info);
    expect(result).toEqual(8);
  });
});
