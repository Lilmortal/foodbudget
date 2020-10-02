import { ScrapeError } from '@foodbudget/errors';
import path from 'path';
import ImportedRecipesScraper from './ImportedRecipesScraper';
import { ScrapedRecipeHTMLElements } from './RecipesScraper.types';

describe('imported recipes job scraper', () => {
  const scrapedRecipeFilePath = `file:${path.join(
    __dirname,
    '__mocks__/mockRecipeWebsite.html',
  )}`;

  it('should scrape a mock website and return the mapped recipes', async () => {
    const scrapedWebsiteInfo: ScrapedRecipeHTMLElements = {
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
    };

    const results = await ImportedRecipesScraper.scrape(scrapedWebsiteInfo);

    expect(results).toEqual({
      link: scrapedRecipeFilePath,
      prepTime: '4 mins',
      servings: 5,
      name: 'Big Mac',
      ingredients: ['Pig', 'Lettuce'],
      cuisines: [],
      diets: [],
      allergies: [],
    });
  });

  it('should throw a ScrapeError if attempting to scrape an invalid document selector', async () => {
    const scrapedWebsiteInfo: ScrapedRecipeHTMLElements = {
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
    };

    expect(ImportedRecipesScraper.scrape(scrapedWebsiteInfo)).toThrow(ScrapeError);
  });
});
