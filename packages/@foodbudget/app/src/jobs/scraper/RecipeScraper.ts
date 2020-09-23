import puppeteer from "puppeteer";
import { RecipeRepository } from "../../repository/recipe";
import { Emailer } from "../../services/email";
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
export interface WebPageScrapedInfo {
  url: string;
  prepTimeSelector: DocumentNode;
  servingsSelector: DocumentNode;
  recipeNameSelector: DocumentNode;
  ingredientsSelector: DocumentNode;
}

interface ScraperService {
  scrape(webPageScrapedInfo: WebPageScrapedInfo[]): Promise<void>;
}

// @TODO: Think of a better name...
interface ScraperConnections {
  recipeRepository: RecipeRepository;
  emailer: Emailer;
}

interface Scraper extends ScraperConnections, ScraperService {}

export class RecipeScraper implements Scraper {
  recipeRepository: RecipeRepository;
  emailer: Emailer;

  constructor({ recipeRepository, emailer }: ScraperConnections) {
    this.recipeRepository = recipeRepository;
    this.emailer = emailer;
  }

  async scrape(webPageScrapedInfos: WebPageScrapedInfo[]) {
    try {
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

          const parsedPageInfo: WebPageScrapedInfo = JSON.parse(pageInfo);

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

        const recipe = {
          ...validatedRecipe,
          cuisines: [],
          diets: [],
          allergies: [],
          link: pageInfo.url,
        };

        console.log("saving new recipe...");
        console.log(recipe);

        // recipeRepository.create(recipe);

        // send an email notification that a new website page has been scraped, and require
        // additional manual insertion of the remaining properties.
        // this.emailer.send({
        //   from: config.email.user,
        //   to: config.email.user,
        //   subject: `recipe ${recipe.name} has been scraped.`,
        //   text: "Now we just have to manuallly input the remaining criterias.",
        // });
      });
      // await browser.close();
    } catch (err) {
      throw new ScraperError(err);
    }
  }
}
