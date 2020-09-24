import config from "../../config";
import { AgendaJob } from "./AgendaJob";

describe("agenda job", () => {
  let agendaJob: AgendaJob;

  const createAgendaJob = (agendaDatabaseUrl?: string) => {
    return new AgendaJob(agendaDatabaseUrl || config.agenda.url);
  };

  beforeEach(() => {
    jest.useFakeTimers();

    agendaJob = createAgendaJob();
  });

  // @TODO: Fix
  it("should run multiple jobs", async () => {
    const job1 = jest.fn;

    agendaJob.createJob(0, job1, "job definition");
    await agendaJob.start();

    jest.advanceTimersByTime(2000);

    agendaJob.instance.on("success:job definition", async () => {
      console.log("run");
      expect(job1).not.toBeCalled();
    });

    // expect(job1).toBeCalled();
    await agendaJob.stop();
  });

});
