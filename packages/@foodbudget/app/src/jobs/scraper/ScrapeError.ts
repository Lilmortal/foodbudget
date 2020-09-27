import { StatusError } from "../../shared/errors";

export class ScrapeError extends StatusError {
  constructor(message: string) {
    super(200, message);
    this.type = "SCRAPER_ERROR";
  }
}
