import { Recipe } from '@foodbudget/api';
import { ScrapeError } from '@foodbudget/errors';
import scrapedRecipeElements from '../config/scrapedRecipesElements';
import { ScrapedRecipe } from './recipes';
import Scraper from './Scraper';
import setupHeadlessBrowser from './utils';

jest.mock('./utils');

describe('scraper', () => {
  let mockOnScrape: jest.Mock<(scrapeInfo: string) => Promise<ScrapedRecipe>>;
  let mockMapping: jest.Mock<(scrapedResult: ScrapedRecipe) => Recipe>;
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

    mockOnScrape = jest.fn(() => async () => scrapedRecipe);
    mockMapping = jest.fn(() => () => recipe);
  });

  afterEach(() => {
    jest.clearAllMocks();
    jest.resetAllMocks();
  });

  it('should scrape and return the mapped recipe', async () => {
    (setupHeadlessBrowser as jest.Mock).mockImplementation(() => ({
      scrape: async () => scrapedRecipe,
    }));
    const scraper = new Scraper<ScrapedRecipe, Recipe>({ onScrape: mockOnScrape(), mapping: mockMapping() });

    await expect(scraper.scrape(scrapedRecipeElements)).resolves.toEqual(recipe);
  });

  it('should scrape and return an array of mapped recipes', async () => {
    (setupHeadlessBrowser as jest.Mock).mockImplementation(() => ({
      scrape: async () => [scrapedRecipe],
    }));

    const scraper = new Scraper<ScrapedRecipe, Recipe>({ onScrape: mockOnScrape(), mapping: mockMapping() });

    await expect(scraper.scrape(scrapedRecipeElements)).resolves.toEqual([recipe]);
  });

  it('should retry scraping up to 4 times when it throws an error', async () => {
    const throwAnErrorWhenAttemptingToScrape = (retries: number) => {
      for (let i = 0; i < retries; i += 1) {
        (setupHeadlessBrowser as jest.Mock).mockImplementationOnce(() => ({
          scrape: async () => {
            throw new Error();
          },
        }));
      }
    };

    const retries = 4;
    throwAnErrorWhenAttemptingToScrape(retries);

    (setupHeadlessBrowser as jest.Mock).mockImplementation(() => ({
      scrape: async () => scrapedRecipe,
    }));

    const scraper = new Scraper<ScrapedRecipe, Recipe>({ onScrape: mockOnScrape(), mapping: mockMapping() });
    const spiedScrape = jest.spyOn(scraper, 'scrape');

    await expect(scraper.scrape(scrapedRecipeElements, retries)).resolves.toEqual(recipe);

    expect(spiedScrape).toBeCalledTimes(retries + 1);
  });

  it('should throw a ScrapeError after attempting to retry scraping up to 3 times', async () => {
    (setupHeadlessBrowser as jest.Mock).mockImplementation(() => ({
      scrape: async () => {
        throw new Error();
      },
    }));

    const scraper = new Scraper<ScrapedRecipe, Recipe>({ onScrape: mockOnScrape(), mapping: mockMapping() });
    const spiedScrape = jest.spyOn(scraper, 'scrape');

    await expect(scraper.scrape(scrapedRecipeElements, 2)).rejects.toThrow(ScrapeError);

    expect(spiedScrape).toBeCalledTimes(3);
  });
});
