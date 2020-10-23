import dotenv from 'dotenv';
import findConfig from 'find-config';

if (!process.env.CI) {
  const env = dotenv.config({ path: findConfig('.env') || undefined });

  if (env.error) {
    throw env.error;
  }
}

export interface EmailConfig {
  from: string;
  to: string;
}

export interface Config {
  env: string;
  email: EmailConfig;
}

const config: Config = {
  env: process.env.NODE_ENV || 'dev',
  email: {
    from: 'thefoodbudget@gmail.com',
    to: 'thefoodbudget@gmail.com',
  },
};

export default config;
