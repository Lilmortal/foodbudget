import { ScrapedRecipeHTMLElements } from '../scraper/recipes';

export interface HeadlessBrowserConfig {
  retries: number;
}

export interface EmailConfig {
  sender: string;
  receiver: string;
}

export interface Config {
  scrapedRecipeElements: ScrapedRecipeHTMLElements[];
  headlessBrowser: HeadlessBrowserConfig;
  email: EmailConfig;
}
