import dotenv from 'dotenv';
import findConfig from 'find-config';
import { Config } from './config.types';

if (!process.env.CI) {
  const env = dotenv.config({ path: findConfig('.env') || undefined });
  if (env.error) {
    throw env.error;
  }
}

const config: Config = {
  api: {
    prefix: '/graphql',
    port: 8080,
  },
};

export default config;
