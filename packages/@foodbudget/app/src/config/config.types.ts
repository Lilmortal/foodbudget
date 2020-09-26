import { WebPageScrapedRecipeInfo } from "../jobs/scraper";
import { Service } from "../services/email";

export interface AgendaConfig {
  url: string;
}

export interface EmailConfig {
  service: Service;
  user: string;
  password: string;
}

export interface HeadlessBrowserConfig {
  retries: number;
}

export interface Config {
  agenda: AgendaConfig;
  email: EmailConfig;
  scrapedWebsiteInfo: WebPageScrapedRecipeInfo[];
  headlessBrowser: HeadlessBrowserConfig;
}
