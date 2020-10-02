import { Recipe, ServiceManager } from '@foodbudget/app';

import { Mailer } from '@foodbudget/email';
import config from '../config';
import { RecipesScraper, ScrapedRecipe } from '../scraper/recipes';
import JobRecipesScraper from './JobRecipesScraper';

jest.mock('../scraper/recipes');

describe('job recipes scraper', () => {
  let recipe: Recipe;
  let serviceManager: jest.Mock<ServiceManager, []>;
  let emailer: jest.Mock<Mailer>;
  let mockRecipeScraper: jest.Mock<RecipesScraper<ScrapedRecipe>>;
  const mockRecipeScrapers: jest.Mock<RecipesScraper<ScrapedRecipe>>[] = [];
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

    const recipeServices = jest.fn(() => ({
      save: async () => recipe,
    }))();

    serviceManager = jest.fn(() => ({
      recipeServices,
    } as unknown as ServiceManager));

    emailer = jest.fn();
    mockRecipeScraper = jest.fn((RecipesScraper as jest.Mock).mockImplementation(() => ({
      scrape: async () => recipe,
    })));

    mockRecipeScrapers.push(mockRecipeScraper);

    recipeScrapers = mockRecipeScrapers.map((mockScraper) => mockScraper());
  });

  afterEach(() => {
    jest.resetAllMocks();
    jest.clearAllMocks();
  });

  it('should scrape and return the scraped recipe', async () => {
    const jobRecipesScraper = new JobRecipesScraper(
      { serviceManager: serviceManager(), emailer: emailer(), recipeScrapers },
    );

    const result = await jobRecipesScraper.scrape(config.scrapedRecipeElements);
    expect(result).toEqual([recipe]);
  });

  // @TODO:
  //   it('should scrape and save the recipe', async () => {
  //     // const recipeServices = jest.fn(() => ({
  //     //   save: async () => {
  //     //     throw new Error();
  //     //   },
  //     // }))();

  //     // serviceManager = jest.fn(() => ({
  //     //   recipeServices,
  //     // } as unknown as ServiceManager));

  //     const jobRecipesScraper = new JobRecipesScraper(
  //       { serviceManager: serviceManager(), emailer: emailer(), recipeScrapers },
  //     );

  //     await jobRecipesScraper.start(config);
  //   });

  //   it('should scrape and notify that a recipe has been scraped via email', () => {

//   });
});
