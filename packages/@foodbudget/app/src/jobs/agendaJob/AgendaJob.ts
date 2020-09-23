import Agenda from "agenda";

interface Job {
  agendaDatabaseUrl: string;
  createJob(
    interval: number | string,
    job: (job: Agenda.Job, done: (err?: Error) => void) => void
  ): void;
  start(): void;
}

export class AgendaJob implements Job {
  agendaDatabaseUrl: string;
  #agenda?: Agenda;
  #jobDefinition = 0;
  #jobs: (() => Promise<Agenda.Job>)[] = [];

  // As of the time writing this code, native private methods are not supported.
  // See https://github.com/tc39/proposal-private-methods for more details.
  private get _instance() {
    if (!this.#agenda) {
      this.#agenda = new Agenda({
        db: {
          address: this.agendaDatabaseUrl,
          options: { useUnifiedTopology: true },
        },
      });
    }

    return this.#agenda;
  }

  constructor(agendaDatabaseUrl: string) {
    this.agendaDatabaseUrl = agendaDatabaseUrl;
  }

  createJob(
    interval: number | string,
    job: (job: Agenda.Job, done: (err?: Error) => void) => void
  ) {
    // Use a library to generate unique strings, but an incremented number is good enough.
    const definition = this.#jobDefinition++;

    this._instance.define(definition.toString(), job);

    this.#jobs.push(
      async () => await this._instance.every(interval, definition.toString())
    );
  }

  async start() {
    await this._instance.start();
    this.#jobs.map(async (job) => {
      await job();
    });
  }
}
