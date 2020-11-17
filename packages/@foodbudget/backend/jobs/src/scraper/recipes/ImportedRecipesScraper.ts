import puppeteer from 'puppeteer';
import { OnScrape, ScrapedHTMLElement } from '../Scraper.types';
import RecipesScraper from './RecipesScraper';
import { ScrapedRecipe, ScrapedRecipeHTMLElements } from './RecipesScraper.types';

const scrapeRecipe = (scrapeInfo: string) => {
  // Unfortunately we have to move this function inside this scope.
  // Everything in here is serialized and passed on to puppeteer browser, which is running
  // in Chronium. Hence, if you move this function out, it will complain "document is not defined"
  // because document does not exist on Node.
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

const updateScrapeInfoLink = (scrapeInfo: string, link: string) => {
  const parsedScrapedInfo: ScrapedRecipeHTMLElements = JSON.parse(scrapeInfo);

  return JSON.stringify({ ...parsedScrapedInfo, url: link });
};

const scrapeHomePage = (scrapeInfo: string): string[] => {
  const parsedScrapedInfo: ScrapedRecipeHTMLElements = JSON.parse(scrapeInfo);
  const items = parsedScrapedInfo.itemHtmlElement;

  if (!items) {
    return [parsedScrapedInfo.url];
  }

  const nodeList: NodeListOf<HTMLAnchorElement> = document.querySelectorAll(items.class);

  return Array.from(nodeList).map((node) => node.href);
};

const scrapeRecipes: OnScrape<ScrapedRecipe[]> = (
  page: puppeteer.Page,
) => async (scrapeInfo: string): Promise<ScrapedRecipe[]> => {
  const links = await page.evaluate(scrapeHomePage, scrapeInfo);

  const scrapedRecipes: ScrapedRecipe[] = [];
  for (let i = 0; i < links.length; i += 1) {
    const link = links[i];

    // eslint-disable-next-line no-await-in-loop
    await page.goto(link);

    const updatedScrapeInfo = updateScrapeInfoLink(scrapeInfo, link);
    // eslint-disable-next-line no-await-in-loop
    const scrapedRecipe = await page.evaluate(scrapeRecipe, updatedScrapeInfo);

    scrapedRecipes.push(scrapedRecipe);
  }

  return scrapedRecipes;
};

const importedRecipesScraper = new RecipesScraper(scrapeRecipes);

export default importedRecipesScraper;
