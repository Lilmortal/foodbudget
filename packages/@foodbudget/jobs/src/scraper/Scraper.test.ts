import { Recipe } from '@foodbudget/app';
import { ScrapeError } from '@foodbudget/errors';
import scrapedRecipeElements from '../config/scrapedRecipesElements';
import { ScrapedRecipe } from './recipes';
import Scraper from './Scraper';
import setupHeadlessBrowser from './utils';

jest.mock('./utils');

describe('scraper', () => {
  let onScrape: jest.Mock<(scrapeInfo: string) => Promise<ScrapedRecipe>>;
  let mapping: jest.Mock<(scrapedResult: ScrapedRecipe) => Recipe>;
  let scrapedRecipe: ScrapedRecipe;
  let recipe: Recipe;

  beforeEach(() => {
    scrapedRecipe = {
      link: 'link',
      prepTime: '4 mins',
      servings: '4',
      name: 'Recipe name',
      ingredients: ['pork', 'mushroom'],
      cuisines: [],
      diets: [],
      allergies: [],
    };

    recipe = {
      link: 'link',
      prepTime: '4 mins',
      servings: 4,
      name: 'Recipe name',
      ingredients: ['pork', 'mushroom'],
      cuisines: [],
      diets: [],
      allergies: [],
    };

    onScrape = jest.fn(() => async () => scrapedRecipe);
    mapping = jest.fn(() => () => recipe);
  });

  afterEach(() => {
    jest.clearAllMocks();
    jest.resetAllMocks();
  });

  it('should scrape and return the mapped recipe', async () => {
    (setupHeadlessBrowser as jest.Mock).mockImplementation(() => ({
      scrape: async () => scrapedRecipe,
    }));
    const scraper = new Scraper<ScrapedRecipe, Recipe>({ onScrape: onScrape(), mapping: mapping() });

    await expect(scraper.scrape(scrapedRecipeElements)).resolves.toEqual(recipe);
  });

  it('should scrape and return an array of mapped recipes', async () => {
    (setupHeadlessBrowser as jest.Mock).mockImplementation(() => ({
      scrape: async () => [scrapedRecipe],
    }));

    const scraper = new Scraper<ScrapedRecipe, Recipe>({ onScrape: onScrape(), mapping: mapping() });

    await expect(scraper.scrape(scrapedRecipeElements)).resolves.toEqual([recipe]);
  });

  it('should retry scraping up to 3 times', async () => {
    const throwAnErrorWhenAttemptingToScrape = (call: number) => {
      for (let i = 0; i < call; i += 1) {
        (setupHeadlessBrowser as jest.Mock).mockImplementationOnce(() => ({
          scrape: async () => {
            throw new Error();
          },
        }));
      }
    };

    throwAnErrorWhenAttemptingToScrape(3);

    (setupHeadlessBrowser as jest.Mock).mockImplementation(() => ({
      scrape: async () => scrapedRecipe,
    }));

    const scraper = new Scraper<ScrapedRecipe, Recipe>({ onScrape: onScrape(), mapping: mapping() });
    const spiedScrape = jest.spyOn(scraper, 'scrape');

    await expect(scraper.scrape(scrapedRecipeElements)).resolves.toEqual(recipe);

    expect(spiedScrape).toBeCalledTimes(4);
  });

  it('should throw a ScraperError after attempting to retry scraping up to 4 times', async () => {
    (setupHeadlessBrowser as jest.Mock).mockImplementation(() => ({
      scrape: async () => {
        throw new Error();
      },
    }));

    const scraper = new Scraper<ScrapedRecipe, Recipe>({ onScrape: onScrape(), mapping: mapping() });
    const spiedScrape = jest.spyOn(scraper, 'scrape');

    await expect(scraper.scrape(scrapedRecipeElements)).rejects.toThrow(ScrapeError);

    expect(spiedScrape).toBeCalledTimes(4);
  });
});
