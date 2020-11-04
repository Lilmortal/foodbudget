import { Recipe, ServiceManager } from '@foodbudget/api';
import { Mailer } from '@foodbudget/email';
import { mockDeep, MockProxy } from 'jest-mock-extended';
import config from '../config';
import { RecipesScraper, ScrapedRecipe } from '../scraper/recipes';
import JobRecipesScraper from './JobRecipesScraper';

jest.mock('../scraper/recipes');
jest.mock('@foodbudget/api');

describe('job recipes scraper', () => {
  let recipe: Omit<Recipe, 'id'>;
  let mockServiceManager: MockProxy<ServiceManager>;
  let mockEmailer: jest.Mock<Mailer>;
  let mockRecipeScraper: jest.Mock<RecipesScraper<ScrapedRecipe>>;
  let mockRecipeScrapers: jest.Mock<RecipesScraper<ScrapedRecipe>>[] = [];
  let recipeScrapers: RecipesScraper<ScrapedRecipe>[] = [];

  beforeEach(() => {
    recipe = {
      link: 'recipe link',
      name: 'recipe name',
      prepTime: '4 mins',
      servings: 4,
      numSaved: 0,
      ingredients: [{ text: 'pork' }, { text: 'mushroom' }],
      cuisines: [],
      diets: [],
      allergies: [],
      adjectives: [],
      meals: [],
    };

    mockServiceManager = mockDeep<ServiceManager>();

    mockEmailer = jest.fn<Mailer, []>(() => ({
      send: jest.fn(),
      verify: jest.fn(),
    }));

    mockRecipeScraper = jest.fn((RecipesScraper as jest.Mock).mockImplementation(() => ({
      scrape: async () => recipe,
    })));

    mockRecipeScrapers.push(mockRecipeScraper);

    recipeScrapers = mockRecipeScrapers.map((mockScraper) => mockScraper());
  });

  afterEach(() => {
    jest.resetAllMocks();
    jest.clearAllMocks();

    mockRecipeScrapers = [];
  });

  it('should scrape and return the scraped recipe', async () => {
    const jobRecipesScraper = new JobRecipesScraper(
      { serviceManager: mockServiceManager, emailer: mockEmailer(), recipeScrapers },
    );

    const result = await jobRecipesScraper.scrape(config.scrapedRecipeElements);
    expect(result).toEqual([recipe]);
  });

  it('should scrape and save the recipe', async () => {
    const jobRecipesScraper = new JobRecipesScraper(
      { serviceManager: mockServiceManager, emailer: mockEmailer(), recipeScrapers },
    );

    await jobRecipesScraper.start(config);
    expect(jobRecipesScraper.serviceManager.recipeServices.save).toBeCalled();
  });

  it('should throw an Error if saving the recipe failed', async () => {
    mockServiceManager.recipeServices.save.mockImplementation(() => {
      throw new Error();
    });

    const jobRecipesScraper = new JobRecipesScraper(
      { serviceManager: mockServiceManager, emailer: mockEmailer(), recipeScrapers },
    );

    await expect(jobRecipesScraper.start(config)).rejects.toThrowError();
  });

  it('should scrape and notify that a recipe has been scraped via email', async () => {
    const jobRecipesScraper = new JobRecipesScraper(
      { serviceManager: mockServiceManager, emailer: mockEmailer(), recipeScrapers },
    );

    await jobRecipesScraper.start(config);
    expect(jobRecipesScraper.emailer.send).toBeCalled();
  });

  it('should throw an Error if notifying via email failed', async () => {
    mockEmailer.mockImplementationOnce(() => ({
      send: jest.fn(() => {
        throw new Error();
      }),
      verify: jest.fn(),
    }));

    const jobRecipesScraper = new JobRecipesScraper(
      { serviceManager: mockServiceManager, emailer: mockEmailer(), recipeScrapers },
    );

    await expect(jobRecipesScraper.start(config)).rejects.toThrowError();
  });
});
