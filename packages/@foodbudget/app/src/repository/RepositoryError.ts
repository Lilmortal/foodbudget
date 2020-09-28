import { StatusError } from "../shared/errors";

export class RepositoryError extends StatusError {
  constructor(message: string) {
    super(500, message);
    this.type = "REPOSITORY_ERROR";
  }
}
