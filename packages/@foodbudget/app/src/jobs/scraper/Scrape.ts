import puppeteer from "puppeteer";
import { Recipe } from "../../repository/recipe";
import { validate } from "./RecipeScraper.utils";
import { ScraperError } from "./ScraperError";

export interface DocumentNode {
  /**
   * The class name of the document node. e.g. ".class1 .class2"
   */
  class: string;
  /**
   * If specified, returns the indexed document node. If omitted, return an array of all filtered document nodes.
   */
  index?: number;
  /**
   * If specified, substring the scraped string.
   */
  substring?: {
    /**
     * Starting position.
     */
    start: number;
    /**
     * Ending position.
     */
    end?: number;
  };
}

// @TODO: Think of a better name...
export interface WebPageScrapedRecipeInfo {
  /**
   * The URL of the scraped web page.
   */
  url: string;
  /**
   * The selector for prep time.
   */
  prepTimeSelector: DocumentNode;
  /**
   * The selector for servings.
   */
  servingsSelector: DocumentNode;
  /**
   * The selector for the recipe name.
   */
  recipeNameSelector: DocumentNode;
  /**
   * The selector for a list of ingredients.
   */
  ingredientsSelector: DocumentNode;
}

export class Scrape {
  static async recipe(
    webPageScrapedInfos: WebPageScrapedRecipeInfo[]
  ): Promise<Recipe[]> {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();

    // This enables us to read any console log being displayed in the puppeteer browser in our terminal.
    page.on("console", (msg) => console.log(msg.text()));

    const recipes: Recipe[] = await Promise.all(
      webPageScrapedInfos.map(async (pageInfo) => {
        await page.goto(pageInfo.url);

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

          const prepTime = getDocumentNodeTexts(
            parsedPageInfo.prepTimeSelector
          );
          const servings = getDocumentNodeTexts(
            parsedPageInfo.servingsSelector
          );
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
      })
    );
    await browser.close();

    return recipes;
  }
}
