import puppeteer from "puppeteer";
import { Recipe } from "../../repository/recipe";
import { validate } from "./RecipeScraper.utils";
import { ScraperError } from "./ScraperError";

export interface DocumentNode {
  class: string;
  index?: number;
  substring?: {
    start: number;
    end?: number;
  };
}

export interface WebPageScrapedRecipeInfo {
  url: string;
  prepTimeSelector: DocumentNode;
  servingsSelector: DocumentNode;
  recipeNameSelector: DocumentNode;
  ingredientsSelector: DocumentNode;
}

export class Scrape {
  static async recipe(
    webPageScrapedInfos: WebPageScrapedRecipeInfo[]
  ): Promise<Recipe | undefined> {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();

    webPageScrapedInfos.forEach(async (pageInfo) => {
      await page.goto(pageInfo.url);

      // This enables us to read any console log being displayed in the puppeteer browser in our terminal.
      page.on("console", (msg) => console.log(msg.text()));

      // We pass the page info as a serialized JSON object into the puppeteer browser.
      const scrapedRecipe = await page.evaluate(async (pageInfo: string) => {
        // Unfortunately we have to move these functions inside this scope.
        // Everything in here is serialized and passed on to puppeteer browser.
        // If you move these functions out to the parent scope, you will see that puppeteer complains these functions
        // are not defined.
        const getDocumentNodeTexts = (nodeSelector: DocumentNode) => {
          const nodeList: NodeListOf<HTMLElement> = document.querySelectorAll(
            nodeSelector.class
          );

          let nodeText: string | string[];
          if (nodeSelector.index !== undefined) {
            // It's not an array, hence treat it like a single node.
            nodeText = nodeList[nodeSelector.index].innerText.substring(
              nodeSelector.substring?.start || 0,
              nodeSelector.substring?.end
            );
          } else {
            nodeText = Array.from(nodeList).map((node) => node.innerText);
          }

          return nodeText;
        };

        const parsedPageInfo: WebPageScrapedRecipeInfo = JSON.parse(pageInfo);

        const prepTime = getDocumentNodeTexts(parsedPageInfo.prepTimeSelector);
        const servings = getDocumentNodeTexts(parsedPageInfo.servingsSelector);
        const name = getDocumentNodeTexts(parsedPageInfo.recipeNameSelector);
        const ingredients = getDocumentNodeTexts(
          parsedPageInfo.ingredientsSelector
        );

        return {
          prepTime,
          servings,
          name,
          ingredients,
        };
      }, JSON.stringify(pageInfo));

      const validatedRecipe = validate({
        ...scrapedRecipe,
      });

      const recipe: Recipe = {
        ...validatedRecipe,
        cuisines: [],
        diets: [],
        allergies: [],
        link: pageInfo.url,
      };

      return recipe;
    });
    // await browser.close();

    return undefined;
  }
}
