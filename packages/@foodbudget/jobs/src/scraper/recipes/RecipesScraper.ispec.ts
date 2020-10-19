import { OnScrape } from '../Scraper.types';
import RecipesScraper from './RecipesScraper';
import { ScrapedRecipe, ScrapedRecipeHTMLElements } from './RecipesScraper.types';

describe('recipes job scraper', () => {
  beforeEach(() => {
    jest.setTimeout(30000);
  });

  afterEach(() => {
    jest.setTimeout(5000);
  });

  it('should scrape and return the mapped recipes given the onScrape function', async () => {
    const onScrape: OnScrape<ScrapedRecipe> = async () => ({
      prepTime: '4 mins',
      servings: '4',
      numSaved: '0',
      name: 'Big Mac',
      ingredients: ['Pig', 'Lettuce'],
      link: 'http://fakewebsite.com',
      cuisines: [],
      diets: [],
      allergies: [],
      adjectives: [],
      meals: [],
    });

    const scrapedWebsiteInfo: ScrapedRecipeHTMLElements = {
      url: 'http://fakewebsite.com',
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

    const recipesScraper = new RecipesScraper(onScrape);
    const results = await recipesScraper.scrape(scrapedWebsiteInfo);

    expect(results).toEqual({
      link: 'http://fakewebsite.com',
      prepTime: '4 mins',
      servings: 4,
      name: 'Big Mac',
      numSaved: 0,
      ingredients: ['Pig', 'Lettuce'],
      cuisines: [],
      diets: [],
      allergies: [],
    });
  });

  it('should throw an Error if prepTime is an empty string', async () => {
    const onScrape: OnScrape<ScrapedRecipe> = async () => ({
      prepTime: '',
      servings: '4',
      name: 'Big Mac',
      numSaved: '0',
      ingredients: ['Pig', 'Lettuce'],
      link: 'http://fakewebsite.com',
      cuisines: [],
      diets: [],
      allergies: [],
      adjectives: [],
      meals: [],
    });

    const scrapedWebsiteInfo: ScrapedRecipeHTMLElements = {
      url: 'http://fakewebsite.com',
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

    const recipesScraper = new RecipesScraper(onScrape);

    await expect(recipesScraper.scrape(scrapedWebsiteInfo)).rejects.toThrowError();
  });
});
