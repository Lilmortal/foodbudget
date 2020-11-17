import createEmailer from '@foodbudget/email';
import { serviceManager } from '@foodbudget/api';
import config from './config';

import CronJob from './cron';
import JobRecipesScraper from './jobs/JobRecipesScraper';
import { recipesScraper } from './scraper/recipes';

(async () => {
  const mailer = await createEmailer();
  const recipesJob = new JobRecipesScraper({
    serviceManager,
    emailer: mailer,
    recipeScrapers: [recipesScraper],
  });

  const cron = new CronJob(config.cron.url);

  cron.createJobs([recipesJob], config);
  await cron.start();
})();
