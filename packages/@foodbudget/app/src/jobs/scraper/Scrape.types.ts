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
