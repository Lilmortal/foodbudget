import logger from '@foodbudget/logger';
import dotenv from 'dotenv';
import findConfig from 'find-config';
import { Config, EnvConfig } from './config.types';

if (!process.env.CI) {
  const env = dotenv.config({ path: findConfig('.env') || undefined });
  if (env.error) {
    throw env.error;
  }
}

const isEnvValid = (env: string): env is EnvConfig => env === 'production' || env === 'development';

const validate = (config: Config) => {
  const errors = [];

  if (!config.google.clientId) {
    errors.push('GOOGLE_CLIENT_ID is missing.');
  }

  if (!config.google.clientSecret) {
    errors.push('GOOGLE_CLIENT_SECRET is missing.');
  }

  if (!config.facebook.clientId) {
    errors.push('FACEBOOK_CLIENT_ID is missing.');
  }

  if (!config.facebook.clientSecret) {
    errors.push('FACEBOOK_CLIENT_SECRET is missing.');
  }

  if (!config.token.access.expireTimeInMs) {
    errors.push('ACCESS_TOKEN_EXPIRE_TIME_IN_MS is missing.');
  }

  if (!config.token.access.secret) {
    errors.push('ACCESS_TOKEN_SECRET is missing.');
  }

  if (!config.token.refresh.expireTimeInMs) {
    errors.push('REFRESH_TOKEN_EXPIRE_TIME_IN_MS is missing.');
  }

  if (!config.token.refresh.secret) {
    errors.push('REFRESH_TOKEN_SECRET is missing.');
  }

  if (!isEnvValid(config.env)) {
    errors.push('NODE_ENV is invalid.');
  }

  if (errors.length > 0) {
    logger.error(
      `
There are errors attempting to retrieve environment variables. 
Please add them in the .env file if you forget to add them in.
      
${errors.map((error) => `* ${error}`).join('\n').trim()}`,
    );

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
  facebook: {
    clientId: process.env.FACEBOOK_CLIENT_ID || '',
    clientSecret: process.env.FACEBOOK_CLIENT_SECRET || '',
  },
  token: {
    access: {
      secret: process.env.ACCESS_TOKEN_SECRET || '',
      expireTimeInMs: Number(process.env.ACCESS_TOKEN_EXPIRE_TIME_IN_MS) || 0,
    },
    refresh: {
      secret: process.env.REFRESH_TOKEN_SECRET || '',
      expireTimeInMs: Number(process.env.REFRESH_TOKEN_EXPIRE_TIME_IN_MS) || 0,
    },
  },
  env: (process.env.NODE_ENV as EnvConfig) || 'development',
};

if (!validate(config)) {
  process.exit(1);
}

export default config;
