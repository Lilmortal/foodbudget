import StatusError from './StatusError';

export default class ServiceError extends StatusError {
  constructor(message: string) {
    super(200, message);
  }
}
