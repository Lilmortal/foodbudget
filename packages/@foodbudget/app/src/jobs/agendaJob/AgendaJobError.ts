import { StatusError } from '../../shared/errors';

class AgendaJobError extends StatusError {
  constructor(message: string) {
    super(200, message);
    this.type = 'AGENDA_JOB_ERROR';
  }
}

export default AgendaJobError;
