import { Service } from '../Emailer.types';

export interface EmailConfig {
  service: Service;
  user: string;
  password: string;
}

export interface Config {
  email: EmailConfig;
}
