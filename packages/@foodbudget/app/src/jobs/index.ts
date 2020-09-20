import config from "../config";

import { agendaJob, recipeScraperAgenda } from "./recipeScraper";
import { PrismaClient } from "@prisma/client";
import { RecipeRepository } from "../repository/recipe";
import { EmailerApi } from "../services/email";

export interface JobsConnections {
  recipeRepository: RecipeRepository;
  emailer: EmailerApi;
}

const jobs = ({ recipeRepository, emailer }: JobsConnections) => {
  const agenda = recipeScraperAgenda(config.agenda.url);
  const recipeScraper = agendaJob(agenda);

  recipeScraper.scrape({
    recipeRepository,
    emailer,
    pageInfo: config.scrapedWebsiteInfo,
  });
};

export default jobs;
