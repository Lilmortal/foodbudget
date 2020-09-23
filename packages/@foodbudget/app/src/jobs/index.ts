import config from "../config";

import { RecipeRepository } from "../repository/recipe";
import { Emailer } from "../services/email";
import { AgendaJob } from "./agendaJob";
import { RecipeScraper } from "./scraper/RecipeScraper";

interface Jobs {
  recipeRepository: RecipeRepository;
  emailer: Emailer;
}

const jobs = async ({ recipeRepository, emailer }: Jobs) => {
  const agenda = new AgendaJob(config.agenda.url);

  const recipeScraper = new RecipeScraper({ recipeRepository, emailer });
  const recipeScrapeJob = async () =>
    await recipeScraper.scrape(config.scrapedWebsiteInfo);

  await agenda.createJob("10 seconds", recipeScrapeJob);
  await agenda.start();
};

export default jobs;
