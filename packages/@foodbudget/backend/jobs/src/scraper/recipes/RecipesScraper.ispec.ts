import path from 'path';
import { recipesScraper } from './recipesScraper';
import { ScrapedRecipeHTMLElements } from './RecipesScraper.types';

describe('imported recipes job scraper', () => {
  const scrapedRecipeFilePath = `file:${path.join(
    __dirname,
    '__mocks__/mockRecipeWebsite.html',
  )}`;

  it('should scrape a mock website and return the mapped recipes', async () => {
    const scrapedWebsiteInfo: ScrapedRecipeHTMLElements[] = [{
      url: scrapedRecipeFilePath,
      prepTimeHtmlElement: {
        class: '.prepTime',
        index: 0,
      },
      servingsHtmlElement: {
        class: '.servings',
        index: 0,
        substring: {
          start: 12,
          end: 13,
        },
      },
      recipeNameHtmlElement: {
        class: '.recipeName',
        index: 1,
        substring: {
          start: 13,
          end: 20,
        },
      },
      ingredientsHtmlElement: {
        class: '.ingredients',
      },
    }];

    const results = await recipesScraper.scrape(scrapedWebsiteInfo);

    expect(results).toEqual([{
      link: scrapedRecipeFilePath,
      prepTime: '4 mins',
      servings: 5,
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
        text: 'Pig',
      },
      {
        amount: 0,
        measurement: '',
        name: '',
        price: {
          amount: 0,
          currency: '',
        },
        text: 'Lettuce',
      }],
      cuisines: [],
      diets: [],
      allergies: [],
      adjectives: [],
      meals: [],
    }]);
  });

  it('should throw an Error if attempting to scrape an invalid document selector', async () => {
    const scrapedWebsiteInfo: ScrapedRecipeHTMLElements[] = [{
      url: scrapedRecipeFilePath,
      prepTimeHtmlElement: {
        class: '.invalidClass',
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

    await expect(recipesScraper.scrape(scrapedWebsiteInfo)).rejects.toThrowError();
  });
});
