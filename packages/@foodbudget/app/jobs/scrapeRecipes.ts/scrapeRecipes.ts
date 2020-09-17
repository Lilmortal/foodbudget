import puppeteer from "puppeteer";

export interface PageInfo {
  url: string;
  prepTimeSelector: string;
  servingsSelector: string;
  recipeNameSelector: string;
  ingredientsSelector: string[];
}

export type Cuisine =
  | "American"
  | "Italian"
  | "Asian"
  | "Mexican"
  | "Southern and Soul Food"
  | "French"
  | "South-Western"
  | "Barbeque"
  | "Indian"
  | "Chinese"
  | "Cajun & Creole"
  | "Mediterranean"
  | "Greek"
  | "English"
  | "Spanish"
  | "Thai"
  | "German"
  | "Moroccan"
  | "Irish"
  | "Japanese"
  | "Cuban"
  | "Hawaiian"
  | "Swedish"
  | "Hungarian"
  | "Portuguese";

export type Diet =
  | "Ketogenic"
  | "Vegetarian (no meat, no eggs)"
  | "Vegetarian (no meat, no dairy)"
  | "Pescatarian"
  | "Vegan"
  | "Low Foodmap"
  | "Vegetarian"
  | "Paleo";

export type Allergy =
  | "Gluten"
  | "Peanut"
  | "Seafood"
  | "Sesame"
  | "Soy"
  | "Diary"
  | "Egg"
  | "Sulphite"
  | "Tree Nut"
  | "Wheat";

export interface Recipe {
  prepTime: string;
  servings: string;
  name: string;
  ingredients: string[];
  cuisines: Cuisine[];
  diets: Diet[];
  allergies: Allergy[];
}

export class FoodRecipe implements Recipe {
  prepTime: string;
  servings: string;
  name: string;
  ingredients: string[];
  cuisines: Cuisine[];
  diets: Diet[];
  allergies: Allergy[];

  constructor(recipe: Recipe) {
    this.prepTime = recipe.prepTime;
    this.servings = recipe.servings;
    this.name = recipe.name;
    this.ingredients = recipe.ingredients;
    this.cuisines = recipe.cuisines;
    this.diets = recipe.diets;
    this.allergies = recipe.allergies;
  }
}

class RecipeBuilder implements Recipe {
  prepTime: string;
  servings: string;
  name: string;
  ingredients: string[];
  cuisines: Cuisine[];
  diets: Diet[];
  allergies: Allergy[];

  constructor(recipe?: Partial<Recipe>) {
    this.prepTime = recipe?.prepTime || "";
    this.servings = recipe?.servings || "";
    this.name = recipe?.name || "";
    this.ingredients = recipe?.ingredients || [];
    this.cuisines = recipe?.cuisines || [];
    this.diets = recipe?.diets || [];
    this.allergies = recipe?.allergies || [];
  }

  setPrepTime(prepTime: string) {
    this.prepTime = prepTime;
    return this;
  }

  setServings(servings: string) {
    this.servings = servings;
    return this;
  }

  setName(name: string) {
    this.name = name;
    return this;
  }

  setIngredients(ingredients: string[]) {
    this.ingredients = ingredients;
    return this;
  }

  setCuisines(cuisines: Cuisine[]) {
    this.cuisines = cuisines;
    return this;
  }

  setDiets(diets: Diet[]) {
    this.diets = diets;
    return this;
  }

  setAllergies(allergies: Allergy[]) {
    this.allergies = allergies;
    return this;
  }

  build() {
    return new FoodRecipe(this);
  }
}

interface Repository<T> {
  create: (obj: T) => boolean;
}

interface RecipeRepository extends Repository<Recipe> {}

// TODO: Fix ScrapeRepository type.
interface ScrapeRepository extends Repository<unknown> {}

interface Scraper {
  recipeRepository: RecipeRepository;
  scrapeRepository: ScrapeRepository;
}

class RecipeScraper implements Scraper {
  recipeRepository: RecipeRepository;
  scrapeRepository: ScrapeRepository;

  constructor(
    recipeRepository: RecipeRepository,
    scrapeRepository: ScrapeRepository
  ) {
    this.recipeRepository = recipeRepository;
    this.scrapeRepository = scrapeRepository;
  }

  validate(
    pageInfo: Pick<Recipe, "prepTime" | "servings" | "name" | "ingredients">
  ) {
    const emptyResults = [];

    if (!pageInfo.prepTime) {
      emptyResults.push("prepTime");
    }

    if (!pageInfo.servings) {
      emptyResults.push("servings");
    }

    if (!pageInfo.name) {
      emptyResults.push("name");
    }

    if (!pageInfo.ingredients) {
      emptyResults.push("ingredients");
    }

    if (emptyResults) {
      // send an email notification to warn about missing properties.
    }
  }

  async scrape(pageInfo: PageInfo) {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();

    await page.goto(pageInfo.url);

    const recipeBuilder = await page.evaluate(() => {
      const prepTime = pageInfo.prepTimeSelector;
      const servings = pageInfo.servingsSelector;
      const name = pageInfo.recipeNameSelector;
      const ingredients = pageInfo.ingredientsSelector;

      this.validate({ prepTime, servings, name, ingredients });

      return new RecipeBuilder({
        prepTime,
        servings,
        name,
        ingredients,
      });
    });

    this.recipeRepository.create(recipeBuilder.build());

    // send an email notification that a new website page has been scraped, and require
    // additional manual insertion of the remaining properties.

    // add recipeBuilder to incomplete recipe list.
  }
}

export default RecipeScraper;
