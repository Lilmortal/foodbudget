import dotenv from 'dotenv';
import findConfig from 'find-config';

if (!process.env.CI) {
  const env = dotenv.config({ path: findConfig('.env') || undefined });

  if (env.error) {
    throw env.error;
  }
}

export type Env = 'development' | 'test' | 'production';

export type LogLevel = 'error' | 'warn' | 'help' | 'data' | 'info' |
'debug' | 'prompt' | 'http' | 'verbose' | 'input' | 'silly';

export interface Config {
  env: Env;
  logLevel: LogLevel;
}

const isEnv = (env: string): env is Env => env === 'production' || env === 'development' || env === 'test';

const isLogLevel = (logLevel: string): logLevel is LogLevel => logLevel === 'error' || logLevel === 'warn'
 || logLevel === 'help' || logLevel === 'data' || logLevel === 'info' || logLevel === 'debug' || logLevel === 'prompt'
 || logLevel === 'http' || logLevel === 'verbose' || logLevel === 'input' || logLevel === 'silly';

const validate = (config: Config) => {
  const errors = [];

  if (!isEnv(config.env)) {
    errors.push('NODE_ENV is invalid.');
  }

  if (!isLogLevel(config.logLevel)) {
    errors.push('LOG_LEVEL is invalid.');
  }

  if (errors.length > 0) {
    console.error(
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
  env: (process.env.NODE_ENV as Env) || 'development',
  logLevel: (process.env.LOG_LEVEL as LogLevel) || 'info',
};

if (!validate(config)) {
  process.exit(1);
}

export default config;
