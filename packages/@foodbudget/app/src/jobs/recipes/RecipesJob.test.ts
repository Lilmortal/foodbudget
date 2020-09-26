import { Recipe } from "../../repository/recipe";
import { RepositoryError } from "../../repository/RepositoryError";
import { Repository } from "../../repository/types";
import { EmailError } from "../../services/email";
import { Mailer } from "../../services/email/Emailer.types";
import { ScraperError } from "../scraper";
import { RecipesJob } from "./RecipesJob";
import { ScrapedRecipe, WebPageScrapedRecipeInfo } from "./RecipesJob.types";
import { RecipesJobScraper } from "./RecipesJobScraper";
import { errors as puppeteerErrors } from "puppeteer";

const defaultWebPageScrapedRecipeInfo: WebPageScrapedRecipeInfo = {
  url: "url",
  prepTimeSelector: {
    class: ".prepTime",
  },
  servingsSelector: {
    class: ".servings",
  },
  recipeNameSelector: {
    class: ".recipeName",
  },
  ingredientsSelector: {
    class: ".ingredients",
  },
};

const defaultMockRecipeRepository: Repository<Recipe> = {
  create: async () => undefined,
};

const defaultMockEmailer: Mailer = {
  service: "gmail",
  auth: {
    user: "user",
    pass: "pass",
  },
  send: jest.fn(),
  verify: jest.fn(),
};

const defaultMockRecipe: Recipe = {
  link: "recipe link",
  prepTime: "5 mins",
  servings: 4,
  name: "Recipe name",
  ingredients: ["pork", "fish"],
  cuisines: [],
  diets: [],
  allergies: [],
};

const getMockRecipeRepository = (repository?: Partial<Repository<Recipe>>) =>
  jest.fn<Repository<Recipe>, []>(() => ({
    ...defaultMockRecipeRepository,
    ...repository,
  }))();

const getMockEmailer = (mailer?: Partial<Mailer>) =>
  jest.fn<Mailer, []>(() => ({ ...defaultMockEmailer, ...mailer }))();

const getMockRecipe = (recipe?: Partial<Recipe>) =>
  jest.fn<Recipe, []>(() => ({ ...defaultMockRecipe, ...recipe }))();

jest.mock("./RecipesJobScraper");

describe("recipes job", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should scrape and validate the recipe", async () => {
    const scrapedRecipe: ScrapedRecipe = {
      link: "recipe link",
      prepTime: "5 mins",
      servings: "4",
      name: "Recipe name",
      ingredients: ["pork", "fish"],
    };

    (RecipesJobScraper.scrape as jest.Mock).mockReturnValue(scrapedRecipe);

    const mockRecipeRepository = getMockRecipeRepository();

    const mockEmailer = getMockEmailer();

    // @TODO: Removing any will cause Typescript to complain the mock implementation is missing
    // private variables, e.g. #prisma.
    // Adding private keyword will not work.
    // See https://github.com/typescript-eslint/typescript-eslint/issues/1666 for more details.
    const recipesJob = new RecipesJob({
      recipeRepository: mockRecipeRepository as any,
      emailer: mockEmailer as any,
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

  it("should scrape and validate multiple recipes", async () => {
    const scrapedRecipe1: ScrapedRecipe = {
      link: "recipe link",
      prepTime: "5 mins",
      servings: "4",
      name: "Recipe name",
      ingredients: ["pork", "fish"],
    };

    const scrapedRecipe2: ScrapedRecipe = {
      link: "recipe link 2",
      prepTime: "3 mins",
      servings: "2",
      name: "Recipe name 2",
      ingredients: ["chicken", "eel"],
    };

    const scrapedRecipes = [scrapedRecipe1, scrapedRecipe2];

    (RecipesJobScraper.scrape as jest.Mock).mockReturnValue(scrapedRecipes);

    const mockRecipeRepository = getMockRecipeRepository();

    const mockEmailer = getMockEmailer();

    const recipesJob = new RecipesJob({
      recipeRepository: mockRecipeRepository as any,
      emailer: mockEmailer as any,
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

  it("should throw a ScraperError when attempts to scrape recipes failed", async () => {
    (RecipesJobScraper.scrape as jest.Mock).mockImplementationOnce(() => {
      throw new Error();
    });

    const mockRecipeRepository = getMockRecipeRepository();

    const mockEmailer = getMockEmailer();

    const recipesJob = new RecipesJob({
      recipeRepository: mockRecipeRepository as any,
      emailer: mockEmailer as any,
    });

    await expect(() =>
      recipesJob.scrape(defaultWebPageScrapedRecipeInfo, 3)
    ).rejects.toThrow(ScraperError);
  });

  it("should retry to connect to headless browser up to 3 times", async () => {
    const sendTimeoutErrorOnCallingScrape = (numberOfTimesCalled: number) => {
      for (let i = 0; i < numberOfTimesCalled; i++) {
        (RecipesJobScraper.scrape as jest.Mock).mockImplementationOnce(() => {
          throw new puppeteerErrors.TimeoutError();
        });
      }
    };

    sendTimeoutErrorOnCallingScrape(3);

    const mockRecipeRepository = getMockRecipeRepository();

    const mockEmailer = getMockEmailer();

    const recipesJob = new RecipesJob({
      recipeRepository: mockRecipeRepository as any,
      emailer: mockEmailer as any,
    });

    const spiedRecipesJob = jest.spyOn(recipesJob, "scrape");

    await recipesJob.scrape(defaultWebPageScrapedRecipeInfo, 3);

    expect(spiedRecipesJob).toHaveBeenCalledTimes(4);
  });

  it("should throw a ScraperError when the retries counter to connect to headless browser ran out", async () => {
    const sendTimeoutErrorOnCallingScrape = (numberOfTimesCalled: number) => {
      for (let i = 0; i < numberOfTimesCalled; i++) {
        (RecipesJobScraper.scrape as jest.Mock).mockImplementationOnce(() => {
          throw new puppeteerErrors.TimeoutError();
        });
      }
    };

    sendTimeoutErrorOnCallingScrape(4);

    const mockRecipeRepository = getMockRecipeRepository();

    const mockEmailer = getMockEmailer();

    const recipesJob = new RecipesJob({
      recipeRepository: mockRecipeRepository as any,
      emailer: mockEmailer as any,
    });

    const spiedRecipesJob = jest.spyOn(recipesJob, "scrape");

    await expect(() =>
      recipesJob.scrape(defaultWebPageScrapedRecipeInfo, 3)
    ).rejects.toThrow(ScraperError);

    expect(spiedRecipesJob).toHaveBeenCalledTimes(4);
  });

  it("should save the recipe to the database", async () => {
    const mockRecipeRepository = getMockRecipeRepository();

    const mockEmailer = getMockEmailer();

    const recipesJob = new RecipesJob({
      recipeRepository: mockRecipeRepository as any,
      emailer: mockEmailer as any,
    });

    const recipe = getMockRecipe({});
    const result = await recipesJob.save(recipe);

    expect(result).toEqual(true);
  });

  it("should throw a RepositoryError when attempting to save the recipe failed", async () => {
    const mockRecipeRepository = getMockRecipeRepository({
      create: async () => {
        throw new Error();
      },
    });

    const mockEmailer = getMockEmailer({});

    const recipesJob = new RecipesJob({
      recipeRepository: mockRecipeRepository as any,
      emailer: mockEmailer as any,
    });

    const recipe = getMockRecipe();

    await expect(() => recipesJob.save(recipe)).rejects.toThrow(
      RepositoryError
    );
  });

  it("should notify via email that a recipe has been saved", async () => {
    const mockRecipeRepository = getMockRecipeRepository();

    const mockEmailer = getMockEmailer();

    const recipesJob = new RecipesJob({
      recipeRepository: mockRecipeRepository as any,
      emailer: mockEmailer as any,
    });

    const recipe = getMockRecipe();

    const result = await recipesJob.notify(recipe);

    expect(result).toEqual(true);
    expect(mockEmailer.send).toHaveBeenCalledTimes(1);
  });

  it("should notify via email that multiple recipes have been saved", async () => {
    const mockRecipeRepository = getMockRecipeRepository();

    const mockEmailer = getMockEmailer();

    const recipesJob = new RecipesJob({
      recipeRepository: mockRecipeRepository as any,
      emailer: mockEmailer as any,
    });

    const recipe1 = getMockRecipe();
    const recipe2 = getMockRecipe({ name: "Another recipe" });
    const recipes: Recipe[] = [recipe1, recipe2];

    const result = await recipesJob.notify(recipes);

    expect(result).toEqual(true);
    expect(mockEmailer.send).toHaveBeenCalledTimes(2);
  });

  it("should throw an EmailError when attempting to notify failed", async () => {
    const mockRecipeRepository = getMockRecipeRepository();

    const mockEmailer = getMockEmailer({
      send: () => {
        throw new Error();
      },
    });

    const recipesJob = new RecipesJob({
      recipeRepository: mockRecipeRepository as any,
      emailer: mockEmailer as any,
    });

    const recipe = getMockRecipe();

    await expect(() => recipesJob.notify(recipe)).rejects.toThrow(EmailError);
  });
});
