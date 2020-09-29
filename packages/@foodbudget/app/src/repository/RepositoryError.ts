import { StatusError } from '../utils/errors';

class RepositoryError extends StatusError {
  constructor(message: string) {
    super(500, message);
    this.type = 'REPOSITORY_ERROR';
  }
}

export default RepositoryError;
