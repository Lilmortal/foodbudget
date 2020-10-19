import emailer from '@foodbudget/email';
import { serviceManager } from '@foodbudget/api';
import logger from '@foodbudget/logger';
import config from './config';

import CronJob from './cron';
import JobRecipesScraper from './jobs/JobRecipesScraper';
import ImportedRecipesScraper from './scraper/recipes/ImportedRecipesScraper';

(async () => {
  const mailer = await emailer;
  const recipesJob = new JobRecipesScraper({
    serviceManager,
    emailer: mailer,
    recipeScrapers: [ImportedRecipesScraper],
  });

  const cron = new CronJob(config.cron.url);

  cron.createJobs([recipesJob], config);
  await cron.start();
})();
