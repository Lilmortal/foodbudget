import StatusError from './StatusError';

export default class ScrapeError extends StatusError {
  constructor(message: string) {
    super(200, message);
  }
}
