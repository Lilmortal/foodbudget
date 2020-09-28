import Scraper from './Scraper';

describe('scraper', () => {
  it('should run the given function and return the computed result', async () => {
    const scrapeFunc = async (info: string) => {
      const parsedInfo = JSON.parse(info);
      return Number(parsedInfo.num) * 2;
    };

    const scraper = new Scraper(scrapeFunc);

    const info = { url: 'https://doesnotexist.com', num: 2 };
    const result = await scraper.scrape(info);
    expect(result).toEqual(4);
  });
});
