import config from "../config";

import { RecipeRepository } from "../repository/recipe";
import { Emailer } from "../services/email";
import { AgendaJob, AgendaJobError } from "./agendaJob";
import { RecipesJob } from "./recipes";
import { Job } from "./shared/Job.type";

interface Jobs {
  recipeRepository: RecipeRepository;
  emailer: Emailer;
}

const run = (agenda: AgendaJob) => async (...jobs: Job[]) => {
  await Promise.all(
    jobs.map(async (job) => {
      await agenda.createJob(
        job.interval,
        async () => await job.start(config),
        job.definition
      );
    })
  );
};

const jobs = async ({ recipeRepository, emailer }: Jobs) => {
  const recipesJob = new RecipesJob({ recipeRepository, emailer });

  try {
    const agenda = new AgendaJob(config.agenda.url);

    const cronJobsSetup = run(agenda);
    await cronJobsSetup(recipesJob);
    await agenda.start();
  } catch (err) {
    throw new AgendaJobError(err);
  }
};

export default jobs;
