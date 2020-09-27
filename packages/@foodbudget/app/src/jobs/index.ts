import config from "../config";

import { Recipe } from "../repository/recipe";
import { Repository } from "../repository/types";
import { Mailer } from "../services/email/Emailer.types";
import { AgendaJob, AgendaJobError } from "./agendaJob";
import { RecipesJob } from "./recipes";
import { Job } from "./shared/Job.type";

interface Jobs {
  recipeRepository: Repository<Recipe>;
  emailer: Mailer;
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
