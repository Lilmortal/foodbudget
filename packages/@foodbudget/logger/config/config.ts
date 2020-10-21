import dotenv from 'dotenv';
import findConfig from 'find-config';

if (!process.env.CI) {
  const env = dotenv.config({ path: findConfig('.env') || undefined });

  if (env.error) {
    throw env.error;
  }
}

export type EnvConfig = 'development' | 'test' | 'production';

export interface Config {
  env: EnvConfig;
}

const isEnvValid = (env: string): env is EnvConfig => env === 'production' || env === 'development' || env === 'test';

const validate = (config: Config) => {
  const errors = [];

  if (!isEnvValid(config.env)) {
    errors.push('NODE_ENV is invalid.');
  }
};

const config: Config = {
  env: (process.env.NODE_ENV as EnvConfig) || 'development',
};

validate(config);

export default config;
