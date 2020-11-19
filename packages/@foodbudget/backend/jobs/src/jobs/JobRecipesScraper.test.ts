import { Recipe, ServiceManager } from '@foodbudget/api';
import { Mailer } from '@foodbudget/email';
import { mockDeep, MockProxy } from 'jest-mock-extended';
import { config } from '../config';
import { RecipesScraper } from '../scraper/recipes';
import { JobRecipesScraper } from './JobRecipesScraper';

jest.mock('../scraper/recipes');
jest.mock('@foodbudget/api');

describe('job recipes scraper', () => {
  let recipe: Omit<Recipe, 'id'>[];
  let mockServiceManager: MockProxy<ServiceManager>;
  let mockEmailer: jest.Mock<Mailer>;
  let mockRecipeScraper: MockProxy<RecipesScraper> & RecipesScraper;
  let mockRecipeScrapers: RecipesScraper[] = [];

  beforeEach(() => {
    recipe = [{
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
    }];

    mockServiceManager = mockDeep();

    mockEmailer = jest.fn<Mailer, []>(() => ({
      send: jest.fn(),
      verify: jest.fn(),
    }));

    mockRecipeScraper = mockDeep<RecipesScraper>();
    mockRecipeScraper.scrape.mockResolvedValueOnce(recipe);

    mockRecipeScrapers.push(mockRecipeScraper);
  });

  afterEach(() => {
    jest.resetAllMocks();
    jest.clearAllMocks();

    mockRecipeScrapers = [];
  });

  it('should scrape and return the scraped recipe', async () => {
    const jobRecipesScraper = new JobRecipesScraper(
      { serviceManager: mockServiceManager, emailer: mockEmailer(), recipeScrapers: mockRecipeScrapers },
    );

    const result = await jobRecipesScraper.scrape(config.scrapedRecipeElements);
    expect(result).toEqual(recipe);
  });

  it('should scrape and save the recipe', async () => {
    const jobRecipesScraper = new JobRecipesScraper(
      { serviceManager: mockServiceManager, emailer: mockEmailer(), recipeScrapers: mockRecipeScrapers },
    );

    await jobRecipesScraper.start(config);
    expect(jobRecipesScraper.serviceManager.recipeServices.save).toBeCalled();
  });

  it('should throw an Error if saving the recipe failed', async () => {
    mockServiceManager.recipeServices.save.mockImplementation(() => {
      throw new Error();
    });

    const jobRecipesScraper = new JobRecipesScraper(
      { serviceManager: mockServiceManager, emailer: mockEmailer(), recipeScrapers: mockRecipeScrapers },
    );

    await expect(jobRecipesScraper.start(config)).rejects.toThrowError();
  });

  it('should scrape and notify that a recipe has been scraped via email', async () => {
    const jobRecipesScraper = new JobRecipesScraper(
      { serviceManager: mockServiceManager, emailer: mockEmailer(), recipeScrapers: mockRecipeScrapers },
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
      { serviceManager: mockServiceManager, emailer: mockEmailer(), recipeScrapers: mockRecipeScrapers },
    );

    await expect(jobRecipesScraper.start(config)).rejects.toThrowError();
  });
});
