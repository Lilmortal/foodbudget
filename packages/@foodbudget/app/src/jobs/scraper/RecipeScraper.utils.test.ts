import { Recipe } from "../../repository/recipe";
import { validate } from "./RecipeScraper.utils";
import { ScraperError } from "./ScraperError";

const getValidRecipePageInfo = (
  recipePageInfo?: Partial<
    Record<
      keyof Pick<Recipe, "prepTime" | "servings" | "name" | "ingredients">,
      string | string[]
    >
  >
): Record<
  keyof Pick<Recipe, "prepTime" | "servings" | "name" | "ingredients">,
  string | string[]
> => ({
  prepTime: "5 min",
  servings: "4",
  name: "Recipe name",
  ingredients: ["4 cups of water"],
  ...recipePageInfo,
});

describe("recipe scraper utils", () => {
  it("should invalidate prepTime if it is an empty string", () => {
    const validation = () => validate(getValidRecipePageInfo({ prepTime: "" }));
    expect(validation).toThrow(ScraperError);
  });

  it("should invalidate prepTime if it is an array", () => {
    const validation = () =>
      validate(getValidRecipePageInfo({ prepTime: ["5 mins"] }));
    expect(validation).toThrow(ScraperError);
  });

  it("should invalidate servings if it is an empty string", () => {
    const validation = () => validate(getValidRecipePageInfo({ servings: "" }));
    expect(validation).toThrow(ScraperError);
  });

  it("should invalidate servings if it is an array", () => {
    const validation = () =>
      validate(getValidRecipePageInfo({ servings: ["4"] }));
    expect(validation).toThrow(ScraperError);
  });

  it("should invalidate servings if it is an invalid number", () => {
    const validation = () =>
      validate(getValidRecipePageInfo({ servings: "4g" }));
    expect(validation).toThrow(ScraperError);
  });

  it("should invalidate name if it is an empty string", () => {
    const validation = () => validate(getValidRecipePageInfo({ name: "" }));
    expect(validation).toThrow(ScraperError);
  });

  it("should invalidate name if it is an array", () => {
    const validation = () =>
      validate(getValidRecipePageInfo({ name: ["5 mins"] }));
    expect(validation).toThrow(ScraperError);
  });

  it("should invalidate ingredients if it is an empty array", () => {
    const validation = () =>
      validate(getValidRecipePageInfo({ ingredients: [] }));
    expect(validation).toThrow(ScraperError);
  });

  it("should invalidate ingredients if it is not an array", () => {
    const validation = () =>
      validate(getValidRecipePageInfo({ ingredients: "5 mins" }));
    expect(validation).toThrow(ScraperError);
  });

  it("should validate a valid recipe page info", () => {
    const validation = () => validate(getValidRecipePageInfo());
    expect(validation).not.toThrow(Error);
  });
});
