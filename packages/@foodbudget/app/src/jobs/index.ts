import Agenda from "agenda";
import config from "../config";

import { RecipeRepository } from "../repository/recipe";
import { Emailer } from "../services/email";
import { AgendaJob, AgendaJobError } from "./agendaJob";
import { RecipesJob } from "./recipes";

interface Jobs {
  recipeRepository: RecipeRepository;
  emailer: Emailer;
}

const jobs = async ({ recipeRepository, emailer }: Jobs) => {
  const recipesJob = new RecipesJob({ recipeRepository, emailer });

  try {
    const agenda = new AgendaJob(config.agenda.url);

    await agenda.createJob("10 seconds", recipesJob, "scrape recipe");
    await agenda.start();
  } catch (err) {
    throw new AgendaJobError(err);
  }
};

export default jobs;
