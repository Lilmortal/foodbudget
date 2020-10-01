import StatusError from './StatusError';

export default class EmailError extends StatusError {
  constructor(message: string) {
    super(200, message);
  }
}
