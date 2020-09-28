import { StatusError } from "../../shared/errors";

export class AgendaJobError extends StatusError {
  constructor(message: string) {
    super(200, message);
    this.type = "AGENDA_JOB_ERROR";
  }
}
