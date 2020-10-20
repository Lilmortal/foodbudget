import dotenv from 'dotenv';
import findConfig from 'find-config';

if (!process.env.CI) {
  const env = dotenv.config({ path: findConfig('.env') || undefined });

  if (env.error) {
    throw env.error;
  }
}

export interface Config {
  env: string;
}

const config: Config = {
  env: process.env.NODE_ENV || 'development',
};

export default config;
