import { StatusError } from "../../libs/errors";

export class ScraperError extends StatusError {
  constructor(message: string) {
    super(200, message);
    this.type = "SCRAPER_ERROR";
  }
}
