import dotenv from 'dotenv';
import findConfig from 'find-config';
import { Config } from './config.types';
import scrapedRecipeElements from './scrapedRecipesElements';

if (!process.env.CI) {
  const env = dotenv.config({ path: findConfig('.env') || undefined });

  if (env.error) {
    throw env.error;
  }
}

const validate = (config: Config) => {
  const errors = [];

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

export const config: Config = {
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
  process.exit();
}
