import { Config } from '../config';

export interface Job {
    /**
     * the time period between each job runs.
     */
    readonly interval: number | string;
    /**
     * a function that will be executed per interval.
     */
    readonly start: (config: Config) => Promise<void>;
    /**
     * an unique string identifier to define this job.
     */
    readonly definition: string;
  }

export interface CronServices {

    /**
     * Create a job that will be triggered per interval which is uniquely
     * defined by the definition.
     *
     * @param job params needed to setup a job.
     */
    createJobs(job: Job | Job[], config: Config): void;
    /**
     * Start the Agenda. Ideally run this after creating one or more jobs.
     */
    start(): void;
    /**
     * Stop the Agenda.
     */
    stop(): void;
  }
