import { Recipe, ServiceManager } from '@foodbudget/app';

import { Mailer } from '@foodbudget/email';
import { EmailError, RepositoryError } from '@foodbudget/errors';
import config from '../config';
import { RecipesScraper, ScrapedRecipe } from '../scraper/recipes';
import JobRecipesScraper from './JobRecipesScraper';

jest.mock('../scraper/recipes');

describe('job recipes scraper', () => {
  let recipe: Recipe;
  let mockServiceManager: jest.Mock<ServiceManager, []>;
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
      ingredients: ['pork', 'mushroom'],
      cuisines: [],
      diets: [],
      allergies: [],
    };

    mockServiceManager = jest.fn<ServiceManager, []>(() => ({
      recipeServices: {
        save: jest.fn(),
      },
    }));

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
      { serviceManager: mockServiceManager(), emailer: mockEmailer(), recipeScrapers },
    );

    const result = await jobRecipesScraper.scrape(config.scrapedRecipeElements);
    expect(result).toEqual([recipe]);
  });

  it('should scrape and save the recipe', async () => {
    const jobRecipesScraper = new JobRecipesScraper(
      { serviceManager: mockServiceManager(), emailer: mockEmailer(), recipeScrapers },
    );

    await jobRecipesScraper.start(config);
    expect(jobRecipesScraper.serviceManager.recipeServices.save).toBeCalled();
  });

  it('should throw a RepositoryError if saving the recipe failed', async () => {
    mockServiceManager.mockImplementationOnce(() => ({
      recipeServices: {
        save: jest.fn(() => {
          throw new Error();
        }),
      },
    }));

    const jobRecipesScraper = new JobRecipesScraper(
      { serviceManager: mockServiceManager(), emailer: mockEmailer(), recipeScrapers },
    );

    await expect(jobRecipesScraper.start(config)).rejects.toThrowError(RepositoryError);
  });

  it('should scrape and notify that a recipe has been scraped via email', async () => {
    const jobRecipesScraper = new JobRecipesScraper(
      { serviceManager: mockServiceManager(), emailer: mockEmailer(), recipeScrapers },
    );

    await jobRecipesScraper.start(config);
    expect(jobRecipesScraper.emailer.send).toBeCalled();
  });

  it('should throw an EmailError if notifying via email failed', async () => {
    mockEmailer.mockImplementationOnce(() => ({
      send: jest.fn(() => {
        throw new Error();
      }),
      verify: jest.fn(),
    }));

    const jobRecipesScraper = new JobRecipesScraper(
      { serviceManager: mockServiceManager(), emailer: mockEmailer(), recipeScrapers },
    );

    await expect(jobRecipesScraper.start(config)).rejects.toThrowError(EmailError);
  });
});
