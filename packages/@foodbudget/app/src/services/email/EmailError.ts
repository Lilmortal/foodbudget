import { StatusError } from '../../shared/errors';

class EmailError extends StatusError {
  constructor(message: string) {
    super(200, message);
    this.type = 'EMAIL_ERROR';
  }
}

export default EmailError;
