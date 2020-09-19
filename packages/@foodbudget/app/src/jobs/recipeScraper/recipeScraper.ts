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

const recipeScraper = ({ recipeRepository }: Scraper) => {
  const validate = (
    pageInfo: Record<
      keyof Pick<Recipe, "prepTime" | "servings" | "name" | "ingredients">,
      string | string[] | number
    >
  ) => {
    const emptyResults = [];

    if (!pageInfo.prepTime && !Array.isArray(pageInfo.prepTime)) {
      emptyResults.push("prepTime must be a non-empty string.");
    }

    if (
      !pageInfo.servings ||
      (!Array.isArray(pageInfo.servings) &&
        isNaN(parseInt(pageInfo.servings.toString())))
    ) {
      emptyResults.push("servings must be a non-empty number.");
    }

    if (!pageInfo.name && !Array.isArray(pageInfo.name)) {
      emptyResults.push("name must be a non-empty string.");
    }

    if (!pageInfo.ingredients && Array.isArray(pageInfo.ingredients)) {
      emptyResults.push("ingredients must be a non-empty string.");
    }

    if (emptyResults) {
      // send an email notification to warn about missing properties.
    }
  };

  const getNodeText = (nodeSelector: DocumentNode) => {
    const nodeList: NodeListOf<HTMLElement> = document.querySelectorAll(
      nodeSelector.class
    );

    if (nodeSelector.index !== undefined) {
      // It's not an array, hence treat it like a single node.
      return nodeList[nodeSelector.index].innerText.substring(
        nodeSelector.substring?.start || 0,
        nodeSelector.substring?.end
      );
    } else {
      return Array.from(nodeList).map((node) => node.innerText);
    }
  };

  return {
    scrape: async (pageInfos: PageInfo[]) => {
      try {
        const browser = await puppeteer.launch();
        const page = await browser.newPage();

        pageInfos.forEach(async (pageInfo) => {
          await page.goto(pageInfo.url);

          page.on("console", (msg) => console.log(msg.text()));

          const recipeBuilder = await page.evaluate(
            async (pageInfo: string) => {
              const pageInfoNode: PageInfo = JSON.parse(pageInfo);

              const prepTime = getNodeText(pageInfoNode.prepTimeSelector);
              const servings = getNodeText(pageInfoNode.servingsSelector);
              const name = getNodeText(pageInfoNode.recipeNameSelector);
              const ingredients = getNodeText(pageInfoNode.ingredientsSelector);

              const nodeTexts = { prepTime, servings, name, ingredients };
              if (validate(nodeTexts)) {
                return {
                  prepTime: nodeTexts.prepTime,
                  servings: parseInt(nodeTexts.servings),
                  name,
                  ingredients,
                  cuisines: [],
                  diets: [],
                  allergies: [],
                  link: pageInfoNode.url,
                };
              }
            },
            JSON.stringify(pageInfo)
          );

          // recipeRepository.create(recipeBuilder);

          // send an email notification that a new website page has been scraped, and require
          // additional manual insertion of the remaining properties.

          // add recipeBuilder to incomplete recipe list.
        });
        // await browser.close();
      } catch (err) {
        throw new Error(err);
      }
    },
  };
};

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
