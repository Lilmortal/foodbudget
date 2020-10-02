import path from 'path';
import ImportedRecipesScraper from './ImportedRecipesScraper';
import { ScrapedRecipeHTMLElements } from './RecipesScraper.types';

describe('imported recipes job scraper', () => {
  it('should scrape and return the recipes', async () => {
    const scrapedRecipeFilePath = `file:${path.join(
      __dirname,
      '__mocks__/mockRecipeWebsite.html',
    )}`;

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
});
