import { Recipe } from '@foodbudget/api';
import scrapedRecipeElements from '../config/scrapedRecipesElements';
import { ScrapedRecipe } from './recipes';
import Scraper from './Scraper';
import { OnScrape } from './Scraper.types';
import setupHeadlessBrowser from './utils';

jest.mock('./utils');

describe('scraper', () => {
  let mockOnScrape: jest.Mock<OnScrape<ScrapedRecipe[]>>;
  let mockMapping: jest.Mock<(
    scrapedResult: ScrapedRecipe,
  ) => Omit<Recipe, 'id'>>;
  let scrapedRecipe: ScrapedRecipe[];
  let recipe: Omit<Recipe, 'id'>;

  beforeEach(() => {
    scrapedRecipe = [
      {
        link: 'link',
        prepTime: '4 mins',
        servings: '4',
        numSaved: '0',
        name: 'Recipe name',
        ingredients: ['pork', 'mushroom'],
        cuisines: [],
        diets: [],
        allergies: [],
        adjectives: [],
        meals: [],
      },
    ];

    recipe = {
      link: 'link',
      prepTime: '4 mins',
      servings: 4,
      numSaved: 0,
      name: 'Recipe name',
      ingredients: [
        {
          text: 'pork',
          name: '',
          price: { amount: 0, currency: '' },
          amount: 0,
          measurement: '',
        },
        {
          text: 'mushroom',
          name: '',
          price: { amount: 0, currency: '' },
          amount: 0,
          measurement: '',
        },
      ],
      cuisines: [],
      diets: [],
      allergies: [],
      adjectives: [],
      meals: [],
    };

    mockOnScrape = jest.fn(() => () => async () => scrapedRecipe);
    mockMapping = jest.fn(() => () => recipe);
  });

  afterEach(() => {
    jest.clearAllMocks();
    jest.resetAllMocks();
  });

  it('should scrape and return an array of mapped recipes', async () => {
    (setupHeadlessBrowser as jest.Mock).mockImplementation(() => ({
      scrape: async () => [scrapedRecipe],
    }));

    const scraper = new Scraper<ScrapedRecipe, Omit<Recipe, 'id'>>({
      onScrape: mockOnScrape(),
      onMapping: mockMapping(),
    });

    await expect(scraper.scrape(scrapedRecipeElements)).resolves.toEqual([
      recipe,
    ]);
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
      scrape: async () => [scrapedRecipe],
    }));

    const scraper = new Scraper<ScrapedRecipe, Omit<Recipe, 'id'>>({
      onScrape: mockOnScrape(),
      onMapping: mockMapping(),
    });
    const spiedScrape = jest.spyOn(scraper, 'scrape');

    await expect(
      scraper.scrape(scrapedRecipeElements, retries),
    ).resolves.toEqual([recipe]);

    expect(spiedScrape).toBeCalledTimes(retries + 1);
  });

  it('should throw an Error after attempting to retry scraping up to 3 times', async () => {
    (setupHeadlessBrowser as jest.Mock).mockImplementation(() => ({
      scrape: async () => {
        throw new Error();
      },
    }));

    const scraper = new Scraper<ScrapedRecipe, Omit<Recipe, 'id'>>({
      onScrape: mockOnScrape(),
      onMapping: mockMapping(),
    });
    const spiedScrape = jest.spyOn(scraper, 'scrape');

    await expect(
      scraper.scrape(scrapedRecipeElements, 2),
    ).rejects.toThrowError();

    expect(spiedScrape).toBeCalledTimes(3);
  });
});
