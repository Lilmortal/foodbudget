import puppeteer, { Page } from "puppeteer";
import Agenda from "agenda";
import { Recipe, RecipeRepository } from "../../repository/recipe";

export interface DocumentNode {
  class: string;
  index?: number;
  substring?: {
    start: number;
    end?: number;
  };
}
export interface PageInfo {
  url: string;
  prepTimeSelector: DocumentNode;
  servingsSelector: DocumentNode;
  recipeNameSelector: DocumentNode;
  ingredientsSelector: DocumentNode;
}

interface Scraper {
  recipeRepository: RecipeRepository;
}

const recipeScraper = ({ recipeRepository }: Scraper) => ({
  scrape: async (pageInfos: PageInfo[]) => {
    try {
      const browser = await puppeteer.launch();
      const page = await browser.newPage();

      pageInfos.forEach(async (pageInfo) => {
        await page.goto(pageInfo.url);

        page.on("console", (msg) => console.log(msg.text()));

        const recipe = await page.evaluate(async (pageInfo: string) => {
          const parsedPageInfo: PageInfo = JSON.parse(pageInfo);

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

          const validate = (
            pageInfo: Record<
              keyof Pick<
                Recipe,
                "prepTime" | "servings" | "name" | "ingredients"
              >,
              string | string[]
            >
          ): Pick<Recipe, "prepTime" | "servings" | "name" | "ingredients"> => {
            const emptyResults = [];

            const validatedPageInfo: Pick<
              Recipe,
              "prepTime" | "servings" | "name" | "ingredients"
            > = {
              prepTime: "",
              servings: 0,
              name: "",
              ingredients: [],
            };

            if (pageInfo.prepTime && !Array.isArray(pageInfo.prepTime)) {
              validatedPageInfo.prepTime = pageInfo.prepTime;
            } else {
              emptyResults.push("prepTime must be a non-empty string.");
            }

            if (
              pageInfo.servings &&
              !Array.isArray(pageInfo.servings) &&
              !isNaN(parseInt(pageInfo.servings))
            ) {
              validatedPageInfo.servings = parseInt(pageInfo.servings);
            } else {
              emptyResults.push("servings must be a non-empty number.");
            }

            if (pageInfo.name && !Array.isArray(pageInfo.name)) {
              validatedPageInfo.name = pageInfo.name;
            } else {
              emptyResults.push("name must be a non-empty string.");
            }

            if (pageInfo.ingredients && Array.isArray(pageInfo.ingredients)) {
              validatedPageInfo.ingredients = pageInfo.ingredients;
            } else {
              emptyResults.push("ingredients must be a non-empty string.");
            }

            if (emptyResults) {
              // send an email notification to warn about missing properties.
            }

            return validatedPageInfo;
          };

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

          const validatedRecipe = validate({
            prepTime,
            servings,
            name,
            ingredients,
          });

          return {
            ...validatedRecipe,
            cuisines: [],
            diets: [],
            allergies: [],
            link: parsedPageInfo.url,
          };
        }, JSON.stringify(pageInfo));

        console.log("saving new recipe...");
        console.log(recipe);

        recipeRepository.create(recipe);

        // send an email notification that a new website page has been scraped, and require
        // additional manual insertion of the remaining properties.

        // add recipe to incomplete recipe list.
      });
      // await browser.close();
    } catch (err) {
      throw new Error(err);
    }
  },
});

const SCRAPE_RECIPE_DEFINITION = "recipe-scrape";

interface JobScrape extends Scraper {
  pageInfo: PageInfo[];
}

export const agendaJob = (agenda: Agenda) => ({
  scrape: async ({ recipeRepository, pageInfo }: JobScrape) => {
    try {
      // agenda.define(SCRAPE_RECIPE_DEFINITION, async () => {
      //   const scraper = recipeScraper({
      //     recipeRepository,
      //   });

      //   await scraper.scrape(pageInfo);
      // });

      // await agenda.start();
      // await agenda.every("10 seconds", SCRAPE_RECIPE_DEFINITION);

      const scraper = recipeScraper({
        recipeRepository,
      });

      await scraper.scrape(pageInfo);
    } catch (err) {
      throw new Error(err);
    }
  },
});
