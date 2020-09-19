import config from "../config";

import { agendaJob, recipeScraperAgenda } from "./recipeScraper";
import { PrismaClient } from "@prisma/client";
import { RecipeRepository } from "../repository/recipe";

export interface JobsConnections {
  recipeRepository: RecipeRepository;
}

const jobs = ({ recipeRepository }: JobsConnections) => {
  const agenda = recipeScraperAgenda(config.agenda.url);
  const recipeScraper = agendaJob(agenda);

  recipeScraper.scrape({
    recipeRepository,
    pageInfo: config.scrapedWebsiteInfo,
  });
};

export default jobs;
