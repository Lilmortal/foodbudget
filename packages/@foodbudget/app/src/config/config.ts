import dotenv from 'dotenv';
import path from 'path';
import { Config } from './config.types';

const env = dotenv.config({ path: path.resolve(__dirname, '../../../../../.env') });

if (env.error) {
  throw new Error('.env file is missing.');
}

const config: Config = {
  api: {
    prefix: '/',
    port: 8080,
  },
};

export default config;
