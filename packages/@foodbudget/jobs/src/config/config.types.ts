import { ScrapedRecipeHTMLElements } from '../scraper/recipes';

export interface CronConfig {
  url: string;
}

export interface HeadlessBrowserConfig {
  retries: number;
}

export interface EmailConfig {
  sender: string;
  receiver: string;
}

export interface Config {
  cron: CronConfig;
  scrapedRecipeElements: ScrapedRecipeHTMLElements[];
  headlessBrowser: HeadlessBrowserConfig;
  email: EmailConfig;
}
