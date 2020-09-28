import { DocumentNode, Scraper } from '../scraper';
import { ScrapedRecipe, WebPageScrapedRecipeInfo } from './RecipesJob.types';

const scrapeRecipes = async (pageInfo: string) => {
  // Unfortunately we have to move these functions inside this scope.
  // Everything in here is serialized and passed on to puppeteer browser.
  // If you move these functions out to the parent scope, you will see that puppeteer complains these functions
  // are not defined.
  const getDocumentNodeTexts = (nodeSelector: DocumentNode) => {
    const nodeList: NodeListOf<HTMLElement> = document.querySelectorAll(
      nodeSelector.class,
    );

    let nodeText: string | string[];
    if (nodeSelector.index !== undefined) {
      // It's not an array, hence treat it like a single node.
      nodeText = nodeList[nodeSelector.index].innerText.substring(
        nodeSelector.substring?.start || 0,
        nodeSelector.substring?.end,
      );
    } else {
      nodeText = Array.from(nodeList).map((node) => node.innerText.substring(
        nodeSelector.substring?.start || 0,
        nodeSelector.substring?.end,
      ));
    }

    return nodeText;
  };

  const parsedPageInfo: WebPageScrapedRecipeInfo = JSON.parse(pageInfo);

  const prepTime = getDocumentNodeTexts(parsedPageInfo.prepTimeSelector);
  const servings = getDocumentNodeTexts(parsedPageInfo.servingsSelector);
  const name = getDocumentNodeTexts(parsedPageInfo.recipeNameSelector);
  const ingredients = getDocumentNodeTexts(parsedPageInfo.ingredientsSelector);

  return {
    prepTime,
    servings,
    name,
    ingredients,
    link: parsedPageInfo.url,
  };
};

const recipeJobScraper = new Scraper<WebPageScrapedRecipeInfo, ScrapedRecipe>(
  scrapeRecipes,
);

export interface RecipesJobScraperServices {
  scrape(scrapedInfo: WebPageScrapedRecipeInfo): Promise<ScrapedRecipe>;
  scrape(scrapedInfo: WebPageScrapedRecipeInfo[]): Promise<ScrapedRecipe[]>;
  scrape(
    scrapedInfo: WebPageScrapedRecipeInfo | WebPageScrapedRecipeInfo[]
  ): Promise<ScrapedRecipe | ScrapedRecipe[]>;
}

async function scrape(
  scrapedInfo: WebPageScrapedRecipeInfo
): Promise<ScrapedRecipe>;
async function scrape(
  scrapedInfo: WebPageScrapedRecipeInfo[]
): Promise<ScrapedRecipe[]>;
async function scrape(
  scrapedInfo: WebPageScrapedRecipeInfo | WebPageScrapedRecipeInfo[],
): Promise<ScrapedRecipe | ScrapedRecipe[]> {
  return recipeJobScraper.scrape(scrapedInfo);
}

export const RecipesJobScraper: RecipesJobScraperServices = {
  scrape,
};
