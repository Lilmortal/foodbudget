import { Recipe, ServiceManager } from '@foodbudget/app';

import { Mailer } from '@foodbudget/email';
import { ScrapeError } from '@foodbudget/errors';
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

    mockEmailer = jest.fn();

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

  // @TODO:
  it('should scrape and save the recipe', async () => {
    // const recipeServices = jest.fn(() => ({
    //   save: async () => {
    //     throw new Error();
    //   },
    // }))();

    // serviceManager = jest.fn(() => ({
    //   recipeServices,
    // } as unknown as ServiceManager));

    const jobRecipesScraper = new JobRecipesScraper(
      { serviceManager: mockServiceManager(), emailer: mockEmailer(), recipeScrapers },
    );

    await jobRecipesScraper.start(config);
    expect(jobRecipesScraper.serviceManager.recipeServices.save).toBeCalled();
  });

  it('should throw a RepositoryError if saving the recipe failed', async () => {
    (mockServiceManager().recipeServices.save as jest.Mock).mockImplementationOnce(async () => {
      throw new Error();
    });

    const jobRecipesScraper = new JobRecipesScraper(
      { serviceManager: mockServiceManager(), emailer: mockEmailer(), recipeScrapers },
    );

    await expect(() => jobRecipesScraper.start(config)).toThrow(ScrapeError);
  });

  it('should scrape and notify that a recipe has been scraped via email', () => {

  });

  it('should throw an EmailError if notifying via email failed', () => {

  });
});
