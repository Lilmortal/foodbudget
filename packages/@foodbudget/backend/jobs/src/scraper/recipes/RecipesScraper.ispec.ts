import { OnScrape } from '../Scraper.types';
import RecipesScraper from './RecipesScraper';
import { ScrapedRecipe, ScrapedRecipeHTMLElements } from './RecipesScraper.types';

describe('recipes job scraper', () => {
  beforeEach(() => {
    jest.setTimeout(300000);
  });

  afterEach(() => {
    jest.setTimeout(5000);
  });

  it('should scrape and return the mapped recipes given the onScrape function', async () => {
    const onScrape: OnScrape<ScrapedRecipe[]> = () => async () => ([{
      prepTime: '4 mins',
      servings: '4',
      numSaved: '0',
      name: 'Big Mac',
      ingredients: ['4 cups of water', '2 pigs'],
      link: 'http://fakewebsite.com',
      cuisines: [],
      diets: [],
      allergies: [],
      adjectives: [],
      meals: [],
    }]);

    const scrapedWebsiteInfo: ScrapedRecipeHTMLElements[] = [{
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
    }];

    const recipesScraper = new RecipesScraper(onScrape);
    const results = await recipesScraper.scrape(scrapedWebsiteInfo);

    expect(results).toEqual([{
      link: 'http://fakewebsite.com',
      prepTime: '4 mins',
      servings: 4,
      name: 'Big Mac',
      numSaved: 0,
      ingredients: [{
        amount: 0,
        measurement: '',
        name: '',
        price: {
          amount: 0,
          currency: '',
        },
        text: '4 cups of water',
      },
      {
        amount: 0,
        measurement: '',
        name: '',
        price: {
          amount: 0,
          currency: '',
        },
        text: '2 pigs',
      }],
      cuisines: [],
      diets: [],
      allergies: [],
      adjectives: [],
      meals: [],
    }]);
  });

  it('should throw an Error if prepTime is an empty string', async () => {
    const onScrape: OnScrape<ScrapedRecipe[]> = () => async () => ([{
      prepTime: '',
      servings: '4',
      name: 'Big Mac',
      numSaved: '0',
      ingredients: [],
      link: 'http://fakewebsite.com',
      cuisines: [],
      diets: [],
      allergies: [],
      adjectives: [],
      meals: [],
    }]);

    const scrapedWebsiteInfo: ScrapedRecipeHTMLElements[] = [{
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
    }];

    const recipesScraper = new RecipesScraper(onScrape);

    await expect(recipesScraper.scrape(scrapedWebsiteInfo)).rejects.toThrowError();
  });
});
