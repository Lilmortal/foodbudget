import path from "path";
import { WebPageScrapedRecipeInfo } from "../scraper";
import { RecipesJobScraper } from "./RecipesJobScraper";

describe("recipes job scraper", () => {
  it("should scrape and return the recipes", async () => {
    const scrapedRecipeFilePath = `file:${path.join(
      __dirname,
      "__mocks__/mockRecipeWebsite.html"
    )}`;

    const scrapedWebsiteInfo: WebPageScrapedRecipeInfo = {
      url: scrapedRecipeFilePath,
      prepTimeSelector: {
        class: ".prepTime",
      },
      servingsSelector: {
        class: ".servings",
        substring: {
          start: 12,
          end: 13,
        },
      },
      recipeNameSelector: {
        class: ".recipeName",
        index: 1,
        substring: {
          start: 13,
          end: 20,
        },
      },
      ingredientsSelector: {
        class: ".ingredients",
      },
    };

    const results = await RecipesJobScraper.scrape(scrapedWebsiteInfo);

    expect(results).toEqual({
      link: scrapedRecipeFilePath,
      prepTime: ["4 mins"],
      servings: ["5"],
      name: "Big Mac",
      ingredients: ["Pig", "Lettuce"],
    });
  });
});
