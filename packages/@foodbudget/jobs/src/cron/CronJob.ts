import logger from '@foodbudget/logger';
import Agenda from 'agenda';
import { Config } from '../config';
import { Job } from './CronJob.types';

export default class CronJob {
  private readonly agendaDatabaseUrl: string;

  readonly instance: Agenda;

  private readonly jobs: (() => Promise<Agenda.Job>)[] = [];

  constructor(agendaDatabaseUrl: string) {
    this.agendaDatabaseUrl = agendaDatabaseUrl;
    this.instance = new Agenda({
      db: {
        address: this.agendaDatabaseUrl,
        options: { useUnifiedTopology: true },
      },
    });
  }

  // @TODO Terminating the application ungracefully does not inform Agenda to restart
  // its jobs queue, this is not working, look into this...
  async handleGracefulShutDown(): Promise<void> {
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
      this.instance.define(job.definition, async () => job.start(config));

      this.jobs.push(async () => this.instance.every(job.interval, job.definition));

      // this.jobs.push(async () => job.start(config));

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
    await this.instance.start();

    logger.info('Agenda job scheduler started.');

    if (this.jobs.length === 0) {
      logger.warn('There are no jobs currently running, have you added any?');
    }

    await Promise.all(
      this.jobs.map(async (job) => job()),
    );

    await this.handleGracefulShutDown();
  }

  async stop(): Promise<void> {
    logger.info('Stopping job scheduler...');
    await this.instance.stop();
  }
}
