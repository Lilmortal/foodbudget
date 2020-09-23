import Agenda from "agenda";

interface Job {
  agendaDatabaseUrl: string;
  createJob(
    interval: number | string,
    job: (job: Agenda.Job, done: (err?: Error) => void) => void,
    definition: string
  ): void;
  start(): void;
  stop(): void;
}

export class AgendaJob implements Job {
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

  createJob(
    interval: number | string,
    job: (job: Agenda.Job, done: (err?: Error) => void) => void,
    definition: string
  ) {
    this.#instance.define(definition, job);

    this.#definitions.push(definition);
    this.#jobs.push(
      async () => await this.#instance.every(interval, definition)
    );
  }

  get jobNames() {
    return this.#definitions;
  }

  async start() {
    await this.#instance.start();

    if (this.#jobs.length === 0) {
      console.warn("There are no jobs currently running, have you added any?");
    }

    this.#jobs.map(async (job) => {
      await job();
    });
  }

  async stop() {
    await this.#instance.stop();
  }
}
