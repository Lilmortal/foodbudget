import Agenda from 'agenda';

// @TODO: Think of a better name...
interface AgendaService {
  /**
   * Database URL used by Agenda, currently only supporting MongoDB.
   */
  agendaDatabaseUrl: string;
  /**
   * Create a job that will be triggered per interval which is uniquely
   * defined by the definition.
   *
   * @param interval the time period between each job runs.
   * @param job a function that will be executed per interval.
   * @param definition an unique string identifier to define this job.
   */
  createJob(
    interval: number | string,
    job: () => Promise<void>,
    definition: string
  ): void;
  /**
   * Start the Agenda. Ideally run this after creating one or more jobs.
   */
  start(): void;
  /**
   * Stop the Agenda.
   */
  stop(): void;
}

class AgendaJob implements AgendaService {
  agendaDatabaseUrl: string;

  #instance: Agenda;

  #definitions: string[] = [];

  #jobs: (() => Promise<Agenda.Job>)[] = [];

  constructor(agendaDatabaseUrl: string) {
    this.agendaDatabaseUrl = agendaDatabaseUrl;
    this.#instance = new Agenda({
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

  createJob(
    interval: number | string,
    job: () => Promise<void>,
    definition: string,
  ): void {
    this.#instance.define(definition, async () => job());

    this.#definitions.push(definition);
    this.#jobs.push(async () => this.#instance.every(interval, definition));

    console.log(`"${definition}" has been added to the job scheduler queue...`);
  }

  get instance(): Agenda {
    return this.#instance;
  }

  async start(): Promise<void> {
    await this.#instance.start();

    console.log('Agenda job scheduler started.');

    if (this.#jobs.length === 0) {
      console.warn('There are no jobs currently running, have you added any?');
    }

    await Promise.all(
      this.#jobs.map(async (job) => {
        await job();
      }),
    );

    await this.handleGracefulShutDown();
  }

  async stop(): Promise<void> {
    console.log('Stopping job scheduler...');
    await this.#instance.stop();
  }
}

export default AgendaJob;
