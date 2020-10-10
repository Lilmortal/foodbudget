import logger from '@foodbudget/logger';
import dotenv from 'dotenv';
import findConfig from 'find-config';
import { Config } from './config.types';

if (!process.env.CI) {
  const env = dotenv.config({ path: findConfig('.env') || undefined });
  if (env.error) {
    throw env.error;
  }
}

const validate = (config: Config) => {
  const errors = [];

  if (!config.google.clientId) {
    errors.push('GOOGLE_CLIENT_ID is missing.');
  }

  if (!config.google.clientSecret) {
    errors.push('GOOGLE_CLIENT_SECRET is missing.');
  }

  if (errors.length > 0) {
    logger.error(
      `There are errors attempting to retrieve environment variables. 
      Please add them in the .env file if you forget to add them in.`,
    );

    logger.error(errors.map((error) => `* ${error}`).join('\n'));

    return false;
  }

  return true;
};

const config: Config = {
  api: {
    prefix: '/graphql',
    port: 8080,
  },
  google: {
    clientId: process.env.GOOGLE_CLIENT_ID || '',
    clientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
  },
};

if (!validate(config)) {
  process.exit(1);
}

export default config;
