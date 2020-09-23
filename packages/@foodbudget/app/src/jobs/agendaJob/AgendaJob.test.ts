import config from "../../config";
import { AgendaJob } from "./AgendaJob";

describe("agenda job", () => {
  let agendaJob: AgendaJob;

  beforeEach(() => {
    jest.useFakeTimers();

    const createAgendaJob = (agendaDatabaseUrl?: string) => {
      return new AgendaJob(agendaDatabaseUrl || config.agenda.url);
    };

    agendaJob = createAgendaJob();
  });

  it("should run multiple jobs", async () => {
    const job1 = jest.fn();
    const job2 = jest.fn();

    agendaJob.createJob(1, job1, "job definition");
    agendaJob.createJob(2, job2, "job definition 2");
    agendaJob.start();

    expect(agendaJob.jobNames).toEqual(["job definition", "job definition 2"]);

    jest.advanceTimersByTime(2000);
    expect(job1).toHaveBeenCalled();

    agendaJob.stop();
  });
});
