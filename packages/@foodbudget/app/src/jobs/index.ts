import config from '../config';

import { Recipe } from '../repository/recipe';
import { Repository } from '../repository';
import { Mailer } from '../services/email';
import { AgendaJob, AgendaJobError } from './agendaJob';
import { RecipesJob } from './recipes';
import { Job } from './shared';

interface Jobs {
  recipeRepository: Repository<Recipe>;
  emailer: Mailer;
}

const run = (agenda: AgendaJob) => async (...jobs: Job[]) => {
  await Promise.all(
    jobs.map(async (job) => {
      await agenda.createJob(
        job.interval,
        async () => job.start(config),
        job.definition,
      );
    }),
  );
};

const jobs = async ({ recipeRepository, emailer }: Jobs): Promise<void> => {
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
