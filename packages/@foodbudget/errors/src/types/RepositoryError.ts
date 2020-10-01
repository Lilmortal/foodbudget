import StatusError from './StatusError';

export default class RepositoryError extends StatusError {
  constructor(message: string) {
    super(500, message);
  }
}
