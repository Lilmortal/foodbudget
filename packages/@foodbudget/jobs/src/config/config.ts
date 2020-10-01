import dotenv from 'dotenv';
import path from 'path';
import { Config } from './config.types';
import scrapedRecipeElements from './scrapedRecipesElements';

const env = dotenv.config({ path: path.resolve(__dirname, '../../../../../.env') });

if (env.error) {
  // console.error('.env file is missing.');
  process.exit(1);
}

const validate = (config: Config) => {
  const errors = [];

  if (!config.cron.url) {
    errors.push('CRON_URL is missing.');
  }

  if (!config.email.sender) {
    errors.push('EMAIL_SENDER is missing.');
  }

  if (!config.email.receiver) {
    errors.push('EMAIL_RECEIVER is missing.');
  }

  if (errors.length > 0) {
    console.error(
      'There are errors attempting to retrieve environment variables.',
    );

    console.error(
      'Please add them in the .env file if you forget to add them in.',
    );

    console.error(errors.map((error) => `* ${error}`).join('\n'));

    return false;
  }

  return true;
};

const config: Config = {
  cron: {
    url: process.env.CRON_URL || '',
  },
  scrapedRecipeElements: [...scrapedRecipeElements],
  headlessBrowser: {
    retries: 3,
  },
  email: {
    sender: 'thefoodbudget@gmail.com',
    receiver: 'thefoodbudget@gmail.com',
  },
};

if (!validate(config)) {
  process.exit(0);
}

export default config;
