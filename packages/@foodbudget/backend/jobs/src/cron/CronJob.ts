import logger from '@foodbudget/logger';
import { schedule as cronSchedule, ScheduledTask } from 'node-cron';
import { Config } from '../config';
import { Job } from './CronJob.types';

/**
 * Add jobs to all be runned when you call 'start()'.
 */
export class CronJob {
  private readonly jobs: ScheduledTask[] = [];

  handleGracefulShutDown(): void {
    process.on('exit', this.stop);

    // catches ctrl+c event
    process.on('SIGINT', this.stop);

    process.on('SIGTERM', this.stop);

    // catches "kill pid" (for example: nodemon restart)
    process.on('SIGUSR1', this.stop);
    process.on('SIGUSR2', this.stop);

    // catches uncaught exceptions
    process.on('uncaughtException', this.stop);
  }

  createJobs(jobs: Job | Job[], config: Config): void {
    const pushJob = (job: Job) => {
      const schedule = cronSchedule(job.interval, () => job.start(config));

      this.jobs.push(schedule);

      logger.info(`"${job.definition}" has been added to the job scheduler queue...`);
    };

    if (Array.isArray(jobs)) {
      jobs.forEach((job) => {
        pushJob(job);
      });
    } else {
      pushJob(jobs);
    }
  }

  async start(): Promise<void> {
    await Promise.all(this.jobs.map(async (task) => task.start()));

    logger.info('Job scheduler starting...');

    if (this.jobs.length === 0) {
      logger.warn('There are no jobs currently running, have you added any?');
    }

    this.handleGracefulShutDown();
  }

  stop(): void {
    logger.info('Stopping job scheduler...');
    this.jobs.forEach((task) => task.stop());
  }
}
