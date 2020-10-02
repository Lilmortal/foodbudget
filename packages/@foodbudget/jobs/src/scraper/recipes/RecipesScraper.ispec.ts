import path from 'path';
import { OnScrape } from '../Scraper.types';
import RecipesScraper from './RecipesScraper';
import { ScrapedRecipe, ScrapedRecipeHTMLElements } from './RecipesScraper.types';

const onScrape: OnScrape<ScrapedRecipe> = async () => ({
  prepTime: '4 mins',
  servings: '4',
  name: 'Big Mac',
  ingredients: ['Pig', 'Lettuce'],
  link: 'recipe link',
  cuisines: [],
  diets: [],
  allergies: [],
});

describe('recipes job scraper', () => {
  it('should scrape and return the recipes', async () => {
    const scrapedRecipeFilePath = `file:${path.join(
      __dirname,
      '__mocks__/mockRecipeWebsite.html',
    )}`;

    const scrapedWebsiteInfo: ScrapedRecipeHTMLElements = {
      url: scrapedRecipeFilePath,
      prepTimeHtmlElement: {
        class: '.prepTime',
      },
      servingsHtmlElement: {
        class: '.servings',
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

    const recipesScraper = new RecipesScraper(onScrape);
    const results = await recipesScraper.scrape(scrapedWebsiteInfo);

    expect(results).toEqual({
      link: 'recipe link',
      prepTime: '4 mins',
      servings: 4,
      name: 'Big Mac',
      ingredients: ['Pig', 'Lettuce'],
      cuisines: [],
      diets: [],
      allergies: [],
    });
  });
});
