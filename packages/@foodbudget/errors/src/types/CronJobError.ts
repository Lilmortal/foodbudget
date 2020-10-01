import StatusError from './StatusError';

export default class CronJobError extends StatusError {
  constructor(message: string) {
    super(200, message);
  }
}
