import createEmailer from '@foodbudget/email';
import { serviceManager } from '@foodbudget/api';
import config from './config';

import CronJob from './cron';
import JobRecipesScraper from './jobs/JobRecipesScraper';
import ImportedRecipesScraper from './scraper/recipes/ImportedRecipesScraper';

(async () => {
  const mailer = await createEmailer();
  const recipesJob = new JobRecipesScraper({
    serviceManager,
    emailer: mailer,
    recipeScrapers: [ImportedRecipesScraper],
  });

  const cron = new CronJob(config.cron.url);

  cron.createJobs([recipesJob], config);
  await cron.start();
})();
