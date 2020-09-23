import Agenda from "agenda";
import config from "../config";

import { RecipeRepository } from "../repository/recipe";
import { Emailer } from "../services/email";
import { AgendaJob, AgendaJobError } from "./agendaJob";
import { RecipeScraperJob } from "./scraper";

interface Jobs {
  recipeRepository: RecipeRepository;
  emailer: Emailer;
}

const jobs = async ({ recipeRepository, emailer }: Jobs) => {
  const recipeScraper = new RecipeScraperJob({ recipeRepository, emailer });

  const recipeScrapeJob = async () =>
    recipeScraper.scrape(config.scrapedWebsiteInfo);

  try {
    const agenda = new AgendaJob(config.agenda.url);

    await agenda.createJob("10 seconds", recipeScrapeJob, "scrape recipe");
    await agenda.start();
  } catch (err) {
    throw new AgendaJobError(err);
  }
};

export default jobs;
