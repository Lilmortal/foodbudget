import { errors as puppeteerErrors } from 'puppeteer';
import { Mail, Mailer } from '@foodbudget/email';
import { ScrapeError, RepositoryError, EmailError } from '@foodbudget/errors';
import { Repository, Recipe } from '@foodbudget/app';
import { ScrapedRecipeHTMLElements } from '../scraper/recipes';
import JobRecipesScraper from './JobRecipesScraper';

const defaultWebPageScrapedRecipeInfo: ScrapedRecipeHTMLElements = {
  url: 'url',
  prepTimeHtmlElement: {
    class: '.prepTime',
  },
  servingsHtmlElement: {
    class: '.servings',
  },
  recipeNameHtmlElement: {
    class: '.recipeName',
  },
  ingredientsHtmlElement: {
    class: '.ingredients',
  },
};

const defaultMockRecipeRepository: Repository<Recipe> = {
  create: async () => undefined,
};

const defaultMockEmailer: Mailer = {
  send: jest.fn(),
  verify: jest.fn(),
};

const defaultMockRecipe: Recipe = {
  link: 'recipe link',
  prepTime: '5 mins',
  servings: 4,
  name: 'Recipe name',
  ingredients: ['pork', 'fish'],
  cuisines: [],
  diets: [],
  allergies: [],
};

const getMockRecipeRepository = (repository?: Partial<Repository<Recipe>>) => {
  const instance = jest.fn<Repository<Recipe>, []>(() => ({
    ...defaultMockRecipeRepository,
    ...repository,
  }));

  return {
    mock: instance,
    instance: instance(),
  };
};

const getMockEmailer = (mailer?: Partial<Mailer>) => {
  const instance = jest.fn<Mailer, []>(() => ({ ...defaultMockEmailer, ...mailer }));

  return {
    mock: instance,
    instance: instance(),
  };
};

const getMockRecipe = (recipe?: Partial<Recipe>) => {
  const instance = jest.fn<Recipe, []>(() => ({ ...defaultMockRecipe, ...recipe }));

  return {
    mock: instance,
    instance: instance(),
  };
};

const defaultMailRecipients: Pick<Mail, 'from' | 'to'> = {
  from: 'sender',
  to: 'receiver',
};

jest.mock('./RecipesJobScraper');

describe('recipes job', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should scrape and validate the recipe', async () => {
    const scrapedRecipe: Recipe = {
      link: 'recipe link',
      prepTime: '5 mins',
      servings: 4,
      name: 'Recipe name',
      ingredients: ['pork', 'fish'],
      cuisines: [],
      diets: [],
      allergies: [],
    };

    (JobRecipesScraper.scrape as jest.Mock).mockReturnValue(scrapedRecipe);

    const mockRecipeRepository = getMockRecipeRepository();

    const mockEmailer = getMockEmailer();

    const recipesJob = new RecipesJob({
      recipeRepository: mockRecipeRepository.instance,
      emailer: mockEmailer.instance,
    });

    const result = await recipesJob.scrape(defaultWebPageScrapedRecipeInfo, 3);
    expect(result).toEqual({
      ...scrapedRecipe,
      allergies: [],
      diets: [],
      servings: 4,
      cuisines: [],
    });
  });

  it('should scrape and validate multiple recipes', async () => {
    const scrapedRecipe1: Recipe = {
      link: 'recipe link',
      prepTime: '5 mins',
      servings: '4',
      name: 'Recipe name',
      ingredients: ['pork', 'fish'],
    };

    const scrapedRecipe2: Recipe = {
      link: 'recipe link 2',
      prepTime: '3 mins',
      servings: '2',
      name: 'Recipe name 2',
      ingredients: ['chicken', 'eel'],
    };

    const scrapedRecipes = [scrapedRecipe1, scrapedRecipe2];

    (RecipesJobScraper.scrape as jest.Mock).mockReturnValue(scrapedRecipes);

    const mockRecipeRepository = getMockRecipeRepository();

    const mockEmailer = getMockEmailer();

    const recipesJob = new RecipesJob({
      recipeRepository: mockRecipeRepository.instance,
      emailer: mockEmailer.instance,
    });

    const result = await recipesJob.scrape(defaultWebPageScrapedRecipeInfo, 3);
    expect(result).toEqual([
      {
        ...scrapedRecipe1,
        allergies: [],
        diets: [],
        servings: 4,
        cuisines: [],
      },
      {
        ...scrapedRecipe2,
        allergies: [],
        diets: [],
        servings: 2,
        cuisines: [],
      },
    ]);
  });

  it('should throw a ScrapeError when attempts to scrape recipes failed', async () => {
    (RecipesJobScraper.scrape as jest.Mock).mockImplementationOnce(() => {
      throw new Error();
    });

    const mockRecipeRepository = getMockRecipeRepository();

    const mockEmailer = getMockEmailer();

    const recipesJob = new RecipesJob({
      recipeRepository: mockRecipeRepository.instance,
      emailer: mockEmailer.instance,
    });

    await expect(() => recipesJob.scrape(defaultWebPageScrapedRecipeInfo, 3)).rejects.toThrow(ScrapeError);
  });

  it('should retry to connect to headless browser up to 3 times', async () => {
    const sendTimeoutErrorOnCallingScrape = (numberOfTimesCalled: number) => {
      for (let i = 0; i < numberOfTimesCalled; i += 1) {
        (RecipesJobScraper.scrape as jest.Mock).mockImplementationOnce(() => {
          throw new puppeteerErrors.TimeoutError();
        });
      }
    };

    sendTimeoutErrorOnCallingScrape(3);

    const mockRecipeRepository = getMockRecipeRepository();

    const mockEmailer = getMockEmailer();

    const recipesJob = new RecipesJob({
      recipeRepository: mockRecipeRepository.instance,
      emailer: mockEmailer.instance,
    });

    const spiedRecipesJob = jest.spyOn(recipesJob, 'scrape');

    await recipesJob.scrape(defaultWebPageScrapedRecipeInfo, 3);

    expect(spiedRecipesJob).toHaveBeenCalledTimes(4);
  });

  it('should throw a ScrapeError when the retries counter to connect to headless browser ran out', async () => {
    const sendTimeoutErrorOnCallingScrape = (numberOfTimesCalled: number) => {
      for (let i = 0; i < numberOfTimesCalled; i += 1) {
        (RecipesJobScraper.scrape as jest.Mock).mockImplementationOnce(() => {
          throw new puppeteerErrors.TimeoutError();
        });
      }
    };

    sendTimeoutErrorOnCallingScrape(4);

    const mockRecipeRepository = getMockRecipeRepository();

    const mockEmailer = getMockEmailer();

    const recipesJob = new RecipesJob({
      recipeRepository: mockRecipeRepository.instance,
      emailer: mockEmailer.instance,
    });

    const spiedRecipesJob = jest.spyOn(recipesJob, 'scrape');

    await expect(() => recipesJob.scrape(defaultWebPageScrapedRecipeInfo, 3)).rejects.toThrow(ScrapeError);

    expect(spiedRecipesJob).toHaveBeenCalledTimes(4);
  });

  it('should save the recipe to the database', async () => {
    const mockRecipeRepository = getMockRecipeRepository();

    const mockEmailer = getMockEmailer();

    const recipesJob = new RecipesJob({
      recipeRepository: mockRecipeRepository.instance,
      emailer: mockEmailer.instance,
    });

    const recipe = getMockRecipe().instance;
    await recipesJob.save(recipe);

    expect(mockRecipeRepository.mock).toHaveBeenCalled();
  });

  it('should throw a RepositoryError when attempting to save the recipe failed', async () => {
    const mockRecipeRepository = getMockRecipeRepository({
      create: async () => {
        throw new Error();
      },
    });

    const mockEmailer = getMockEmailer();

    const recipesJob = new RecipesJob({
      recipeRepository: mockRecipeRepository.instance,
      emailer: mockEmailer.instance,
    });

    const recipe = getMockRecipe().instance;

    await expect(() => recipesJob.save(recipe)).rejects.toThrow(
      RepositoryError,
    );
  });

  it('should notify via email that a recipe has been saved', async () => {
    const mockRecipeRepository = getMockRecipeRepository();

    const mockEmailer = getMockEmailer();

    const recipesJob = new RecipesJob({
      recipeRepository: mockRecipeRepository.instance,
      emailer: mockEmailer.instance,
    });

    const recipe = getMockRecipe().instance;

    await recipesJob.notify(recipe, defaultMailRecipients);

    expect(mockEmailer.instance.send).toHaveBeenCalledTimes(1);
  });

  it('should notify via email that multiple recipes have been saved', async () => {
    const mockRecipeRepository = getMockRecipeRepository();

    const mockEmailer = getMockEmailer();

    const recipesJob = new RecipesJob({
      recipeRepository: mockRecipeRepository.instance,
      emailer: mockEmailer.instance,
    });

    const recipe1 = getMockRecipe().instance;
    const recipe2 = getMockRecipe({ name: 'Another recipe' }).instance;
    const recipes: Recipe[] = [recipe1, recipe2];

    await recipesJob.notify(recipes, defaultMailRecipients);

    expect(mockEmailer.instance.send).toHaveBeenCalledTimes(2);
  });

  it('should throw an EmailError when attempting to notify failed', async () => {
    const mockRecipeRepository = getMockRecipeRepository();

    const mockEmailer = getMockEmailer({
      send: () => {
        throw new Error();
      },
    });

    const recipesJob = new RecipesJob({
      recipeRepository: mockRecipeRepository.instance,
      emailer: mockEmailer.instance,
    });

    const recipe = getMockRecipe().instance;

    await expect(() => recipesJob.notify(recipe, defaultMailRecipients)).rejects.toThrow(EmailError);
  });
});
