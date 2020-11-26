import createEmailer from '@foodbudget/email';
import { serviceManager } from '@foodbudget/api';
import { config } from './config';

import { CronJob } from './cron';
import { JobRecipesScraper } from './jobs';
import { recipesScraper } from './scraper/recipes';

(async () => {
  // const mailer = await createEmailer();
  const recipesJob = new JobRecipesScraper({
    serviceManager,
    // emailer: mailer,
    recipeScrapers: [recipesScraper],
  });

  const cron = new CronJob();

  cron.createJobs([recipesJob], config);
  await cron.start();
})();
