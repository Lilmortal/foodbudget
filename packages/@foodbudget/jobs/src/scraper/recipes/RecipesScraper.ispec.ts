import { ScrapeError } from '@foodbudget/errors';
import { OnScrape } from '../Scraper.types';
import RecipesScraper from './RecipesScraper';
import { ScrapedRecipe, ScrapedRecipeHTMLElements } from './RecipesScraper.types';

describe('recipes job scraper', () => {
  it('should scrape and return the mapped recipes given the onScrape function', async () => {
    const onScrape: OnScrape<ScrapedRecipe> = async () => ({
      prepTime: '4 mins',
      servings: '4',
      name: 'Big Mac',
      ingredients: ['Pig', 'Lettuce'],
      link: 'http://fakewebsite.com',
      cuisines: [],
      diets: [],
      allergies: [],
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
      ingredients: ['Pig', 'Lettuce'],
      cuisines: [],
      diets: [],
      allergies: [],
    });
  });

  it('should throw a ScrapeError if prepTime is an empty string', async () => {
    const onScrape: OnScrape<ScrapedRecipe> = async () => ({
      prepTime: '',
      servings: '4',
      name: 'Big Mac',
      ingredients: ['Pig', 'Lettuce'],
      link: 'http://fakewebsite.com',
      cuisines: [],
      diets: [],
      allergies: [],
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

    expect(results).toThrow(ScrapeError);
  });
});
