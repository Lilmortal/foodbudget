import { StatusError } from '../shared/errors';

class RepositoryError extends StatusError {
  constructor(message: string) {
    super(500, message);
    this.type = 'REPOSITORY_ERROR';
  }
}

export default RepositoryError;
