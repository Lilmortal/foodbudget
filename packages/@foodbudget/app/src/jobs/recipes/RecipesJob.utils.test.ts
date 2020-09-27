import { ScrapeError } from "../scraper";
import { ScrapedRecipe } from "./RecipesJob.types";
import { validate } from "./RecipesJob.utils";

const getValidRecipePageInfo = (
  recipePageInfo?: Partial<ScrapedRecipe>
): ScrapedRecipe => ({
  prepTime: "5 min",
  servings: "4",
  name: "Recipe name",
  ingredients: ["4 cups of water"],
  link: "link",
  ...recipePageInfo,
});

describe("recipe scraper utils", () => {
  it("should invalidate prepTime if it is an empty string", () => {
    const validation = () => validate(getValidRecipePageInfo({ prepTime: "" }));
    expect(validation).toThrow(ScrapeError);
  });

  it("should invalidate prepTime if it is an array", () => {
    const validation = () =>
      validate(getValidRecipePageInfo({ prepTime: ["5 mins"] }));
    expect(validation).toThrow(ScrapeError);
  });

  it("should invalidate servings if it is an empty string", () => {
    const validation = () => validate(getValidRecipePageInfo({ servings: "" }));
    expect(validation).toThrow(ScrapeError);
  });

  it("should invalidate servings if it is an array", () => {
    const validation = () =>
      validate(getValidRecipePageInfo({ servings: ["4"] }));
    expect(validation).toThrow(ScrapeError);
  });

  it("should invalidate servings if it is an invalid number", () => {
    const validation = () =>
      validate(getValidRecipePageInfo({ servings: "4g" }));
    expect(validation).toThrow(ScrapeError);
  });

  it("should invalidate name if it is an empty string", () => {
    const validation = () => validate(getValidRecipePageInfo({ name: "" }));
    expect(validation).toThrow(ScrapeError);
  });

  it("should invalidate name if it is an array", () => {
    const validation = () =>
      validate(getValidRecipePageInfo({ name: ["5 mins"] }));
    expect(validation).toThrow(ScrapeError);
  });

  it("should invalidate ingredients if it is an empty array", () => {
    const validation = () =>
      validate(getValidRecipePageInfo({ ingredients: [] }));
    expect(validation).toThrow(ScrapeError);
  });

  it("should invalidate ingredients if it is not an array", () => {
    const validation = () =>
      validate(getValidRecipePageInfo({ ingredients: "5 mins" }));
    expect(validation).toThrow(ScrapeError);
  });

  it("should validate a valid recipe page info", () => {
    const validation = () => validate(getValidRecipePageInfo());
    expect(validation).not.toThrow(Error);
  });
});
