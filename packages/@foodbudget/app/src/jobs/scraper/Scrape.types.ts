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
