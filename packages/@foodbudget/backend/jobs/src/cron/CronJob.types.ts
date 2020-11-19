import { Config } from '../config';

export interface Job {
  /**
   * the time period between each job runs in cron format.
   */
  readonly interval: string;
  /**
   * a function that will be executed per interval.
   */
  readonly start: (config: Config) => Promise<void>;
  /**
   * an unique string identifier to define this job.
   */
  readonly definition: string;
}
