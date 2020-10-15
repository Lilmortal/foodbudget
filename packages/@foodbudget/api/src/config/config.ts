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

  if (!config.facebook.clientId) {
    errors.push('FACEBOOK_CLIENT_ID is missing.');
  }

  if (!config.facebook.clientSecret) {
    errors.push('FACEBOOK_CLIENT_SECRET is missing.');
  }

  if (!config.token.access.expireTime) {
    errors.push('ACCESS_TOKEN_EXPIRE_TIME is missing.');
  }

  if (!config.token.access.secret) {
    errors.push('ACCESS_TOKEN_SECRET is missing.');
  }

  if (!config.token.refresh.expireTime) {
    errors.push('REFRESH_TOKEN_EXPIRE_TIME is missing.');
  }

  if (!config.token.refresh.secret) {
    errors.push('REFRESH_TOKEN_SECRET is missing.');
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
      expireTime: process.env.ACCESS_TOKEN_EXPIRE_TIME || '',
    },
    refresh: {
      secret: process.env.REFRESH_TOKEN_SECRET || '',
      expireTime: process.env.REFRESH_TOKEN_EXPIRE_TIME || '',
    },
  },
};

if (!validate(config)) {
  process.exit(1);
}

export default config;
