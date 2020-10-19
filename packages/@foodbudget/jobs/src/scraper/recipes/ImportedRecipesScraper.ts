import { ScrapedHTMLElement } from '../Scraper.types';
import RecipesScraper from './RecipesScraper';
import { ScrapedRecipe, ScrapedRecipeHTMLElements } from './RecipesScraper.types';

const scrapeRecipes = async (scrapeInfo: string): Promise<ScrapedRecipe> => {
  // Unfortunately we have to move these functions inside this scope.
  // Everything in here is serialized and passed on to puppeteer browser.
  // If you move these functions out to the parent scope, you will see that puppeteer complains these functions
  // are not defined.

  const getDocumentNodeTexts = (HTMLElement: ScrapedHTMLElement) => {
    const nodeList: NodeListOf<HTMLElement> = document.querySelectorAll(
      HTMLElement.class,
    );

    if (HTMLElement.index !== undefined) {
      // It's not an array, hence treat it like a single node.
      return nodeList[HTMLElement.index]?.innerText.substring(
        HTMLElement.substring?.start || 0,
        HTMLElement.substring?.end,
      );
    }

    return Array.from(nodeList).map((node) => node.innerText.substring(
      HTMLElement.substring?.start || 0,
      HTMLElement.substring?.end,
    ));
  };

  const parsedScrapedInfo: ScrapedRecipeHTMLElements = JSON.parse(scrapeInfo);

  const prepTime = getDocumentNodeTexts(parsedScrapedInfo.prepTimeHtmlElement);
  const servings = getDocumentNodeTexts(parsedScrapedInfo.servingsHtmlElement);
  const name = getDocumentNodeTexts(parsedScrapedInfo.recipeNameHtmlElement);
  const ingredients = getDocumentNodeTexts(parsedScrapedInfo.ingredientsHtmlElement);

  return {
    prepTime,
    servings,
    name,
    numSaved: '0',
    ingredients,
    link: parsedScrapedInfo.url,
    cuisines: [],
    diets: [],
    allergies: [],
    adjectives: [],
    meals: [],
  };
};

const ImportedRecipesScraper = new RecipesScraper(scrapeRecipes);

export default ImportedRecipesScraper;
