import dotenv from 'dotenv';
import findConfig from 'find-config';
import { Service } from '../Emailer.types';
import { Config } from './config.types';

if (!process.env.CI) {
  const env = dotenv.config({ path: findConfig('.env') || undefined });

  if (env.error) {
    throw env.error;
  }
}

const services = ['gmail', 'smtp.ethereal.email'] as Service[];

const isService = (service: string): service is Service => {
  if (services.includes(service as Service)) {
    return true;
  }
  return false;
};

const validate = (config: Config) => {
  const errors = [];

  if (!config.email.service) {
    errors.push('EMAIL_SERVICE is missing.');
  } else if (!isService(config.email.service)) {
    errors.push(
      `EMAIL_SERVICE is not a valid Service type. \n A valid Service type should look like one of the following: 
      [${services.join(', ')}]`,
    );
  }

  if (!config.email.user) {
    errors.push('EMAIL_USER is missing.');
  }

  if (!config.email.password) {
    errors.push('EMAIL_PASSWORD is missing.');
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
  email: {
    service: (process.env.EMAIL_SERVICE as Service) || '',
    user: process.env.EMAIL_USER || '',
    password: process.env.EMAIL_PASSWORD || '',
  },
};

if (!validate(config)) {
  process.exit(1);
}

export default config;
